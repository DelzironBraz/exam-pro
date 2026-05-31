import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../../generated/prisma';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { QuestionEntity } from '../../domain/entities/question.entity';
import {
  QuestionFilters,
  QuestionsRepository,
} from '../../domain/repositories/questions.repository';
import { QuestionMapper } from '../prisma/question.mapper';

@Injectable()
export class PrismaQuestionsRepository
  extends PrismaRepository
  implements QuestionsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(question: QuestionEntity): Promise<QuestionEntity> {
    const created = await this.prisma.question.create({
      data: {
        id: question.id,
        statement: question.statement,
        groupId: question.groupId,
        discipline: question.discipline,
        topic: question.topic,
        difficulty: question.difficulty,
        explanation: question.explanation,
        createdBy: question.createdBy,
        createdAt: question.createdAt,
      },
    });
    return QuestionMapper.toDomain(created);
  }

  async findById(id: string): Promise<QuestionEntity | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });
    return question ? QuestionMapper.toDomain(question) : null;
  }

  async update(question: QuestionEntity): Promise<QuestionEntity> {
    const updated = await this.prisma.question.update({
      where: { id: question.id },
      data: {
        statement: question.statement,
        discipline: question.discipline,
        topic: question.topic,
        difficulty: question.difficulty,
        explanation: question.explanation,
      },
    });
    return QuestionMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }

  async findMany(filters: QuestionFilters): Promise<QuestionEntity[]> {
    const questions = await this.prisma.question.findMany({
      where: this.buildWhere(filters),
      orderBy: { createdAt: 'desc' },
    });
    return questions.map(QuestionMapper.toDomain);
  }

  async count(filters: QuestionFilters): Promise<number> {
    return this.prisma.question.count({
      where: this.buildWhere(filters),
    });
  }

  private buildWhere(filters: QuestionFilters): Prisma.QuestionWhereInput {
    const where: Prisma.QuestionWhereInput = {
      groupId: filters.groupId,
      discipline: filters.discipline,
      topic: filters.topic,
      difficulty: filters.difficulty,
    };

    if (filters.tags?.length) {
      const normalized = filters.tags.map((t) => t.trim().toLowerCase());
      where.tags = {
        some: {
          tag: { name: { in: normalized } },
        },
      };
    }

    return where;
  }
}
