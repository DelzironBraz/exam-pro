import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { AlternativeMapper } from '../prisma/alternative.mapper';

@Injectable()
export class PrismaAlternativesRepository
  extends PrismaRepository
  implements AlternativesRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async createMany(alternatives: AlternativeEntity[]): Promise<void> {
    if (alternatives.length === 0) {
      return;
    }

    await this.prisma.alternative.createMany({
      data: alternatives.map((alt) => ({
        id: alt.id,
        questionId: alt.questionId,
        label: alt.label,
        content: alt.content,
        isCorrect: alt.isCorrect,
      })),
    });
  }

  async findByQuestionId(questionId: string): Promise<AlternativeEntity[]> {
    const alternatives = await this.prisma.alternative.findMany({
      where: { questionId },
      orderBy: { label: 'asc' },
    });
    return alternatives.map(AlternativeMapper.toDomain);
  }

  async deleteByQuestionId(questionId: string): Promise<void> {
    await this.prisma.alternative.deleteMany({ where: { questionId } });
  }
}
