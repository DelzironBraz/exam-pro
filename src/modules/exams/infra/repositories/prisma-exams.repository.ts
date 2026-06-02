import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { ExamEntity } from '../../domain/entities/exam.entity';
import {
  ExamQuestionLink,
  ExamQuestionLinkRow,
  ExamsRepository,
} from '../../domain/repositories/exams.repository';
import { ExamMapper } from '../prisma/exam.mapper';

@Injectable()
export class PrismaExamsRepository extends PrismaRepository implements ExamsRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(exam: ExamEntity): Promise<ExamEntity> {
    const created = await this.prisma.exam.create({
      data: {
        id: exam.id,
        groupId: exam.groupId,
        title: exam.title,
        institution: exam.institution,
        organization: exam.organization,
        year: exam.year,
        roleName: exam.roleName,
        durationMinutes: exam.durationMinutes,
        createdAt: exam.createdAt,
      },
    });
    return ExamMapper.toDomain(created);
  }

  async findById(id: string): Promise<ExamEntity | null> {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    return exam ? ExamMapper.toDomain(exam) : null;
  }

  async findManyByGroup(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<ExamEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const exams = await this.prisma.exam.findMany({
      where: { groupId },
      orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      skip,
      take,
    });
    return exams.map(ExamMapper.toDomain);
  }

  async countByGroup(groupId: string): Promise<number> {
    return this.prisma.exam.count({ where: { groupId } });
  }

  async findByGroupAndTitle(groupId: string, title: string): Promise<ExamEntity | null> {
    const exam = await this.prisma.exam.findFirst({
      where: { groupId, title },
    });
    return exam ? ExamMapper.toDomain(exam) : null;
  }

  async appendQuestions(examId: string, links: ExamQuestionLink[]): Promise<void> {
    const existingIds = await this.findQuestionIds(examId);
    const existingSet = new Set(existingIds);

    const mergedLinks: ExamQuestionLink[] = existingIds.map((questionId, index) => ({
      questionId,
      sortOrder: index,
    }));

    for (const link of links) {
      if (!existingSet.has(link.questionId)) {
        mergedLinks.push({
          questionId: link.questionId,
          sectionId: link.sectionId ?? null,
          sortOrder: mergedLinks.length,
        });
        existingSet.add(link.questionId);
      }
    }

    await this.setQuestions(examId, mergedLinks);
  }

  async update(exam: ExamEntity): Promise<ExamEntity> {
    const updated = await this.prisma.exam.update({
      where: { id: exam.id },
      data: {
        title: exam.title,
        institution: exam.institution,
        organization: exam.organization,
        year: exam.year,
        roleName: exam.roleName,
        durationMinutes: exam.durationMinutes,
      },
    });
    return ExamMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({ where: { id } });
  }

  async setQuestions(examId: string, links: ExamQuestionLink[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.examQuestion.deleteMany({ where: { examId } });

      if (links.length === 0) {
        return;
      }

      await tx.examQuestion.createMany({
        data: links.map((link, index) => ({
          examId,
          questionId: link.questionId,
          sectionId: link.sectionId ?? null,
          sortOrder: link.sortOrder ?? index,
        })),
      });
    });
  }

  async findQuestionIds(examId: string): Promise<string[]> {
    const rows = await this.prisma.examQuestion.findMany({
      where: { examId },
      orderBy: { sortOrder: 'asc' },
      select: { questionId: true },
    });
    return rows.map((row) => row.questionId);
  }

  async findQuestionLinksPaginated(
    examId: string,
    pagination: PaginationParams,
  ): Promise<ExamQuestionLinkRow[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const rows = await this.prisma.examQuestion.findMany({
      where: { examId },
      orderBy: { sortOrder: 'asc' },
      skip,
      take,
      select: {
        questionId: true,
        sectionId: true,
        sortOrder: true,
      },
    });

    return rows.map((row) => ({
      questionId: row.questionId,
      sectionId: row.sectionId,
      sortOrder: row.sortOrder,
    }));
  }

  async countQuestions(examId: string): Promise<number> {
    return this.prisma.examQuestion.count({ where: { examId } });
  }

  async countQuestionsByExamIds(examIds: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (examIds.length === 0) {
      return map;
    }

    const counts = await this.prisma.examQuestion.groupBy({
      by: ['examId'],
      where: { examId: { in: examIds } },
      _count: { questionId: true },
    });

    for (const row of counts) {
      map.set(row.examId, row._count.questionId);
    }

    for (const id of examIds) {
      if (!map.has(id)) {
        map.set(id, 0);
      }
    }

    return map;
  }
}
