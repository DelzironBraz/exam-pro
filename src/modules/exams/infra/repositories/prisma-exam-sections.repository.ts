import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { ExamSectionEntity } from '../../domain/entities/exam-section.entity';
import { ExamSectionsRepository } from '../../domain/repositories/exam-sections.repository';
import { ExamSectionMapper } from '../prisma/exam-section.mapper';

@Injectable()
export class PrismaExamSectionsRepository
  extends PrismaRepository
  implements ExamSectionsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(section: ExamSectionEntity): Promise<ExamSectionEntity> {
    const created = await this.prisma.examSection.create({
      data: {
        id: section.id,
        examId: section.examId,
        name: section.name,
        weight: section.weight,
        sortOrder: section.order,
      },
    });
    return ExamSectionMapper.toDomain(created);
  }

  async findByExam(examId: string): Promise<ExamSectionEntity[]> {
    const sections = await this.prisma.examSection.findMany({
      where: { examId },
      orderBy: { sortOrder: 'asc' },
    });
    return sections.map(ExamSectionMapper.toDomain);
  }

  async findById(id: string): Promise<ExamSectionEntity | null> {
    const section = await this.prisma.examSection.findUnique({ where: { id } });
    return section ? ExamSectionMapper.toDomain(section) : null;
  }

  async getNextOrder(examId: string): Promise<number> {
    const last = await this.prisma.examSection.findFirst({
      where: { examId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return (last?.sortOrder ?? -1) + 1;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examSection.delete({ where: { id } });
  }

  async assignQuestionsToSection(
    examId: string,
    sectionId: string,
    questionIds: string[],
  ): Promise<void> {
    await this.prisma.examQuestion.updateMany({
      where: {
        examId,
        questionId: { in: questionIds },
      },
      data: { sectionId },
    });
  }
}
