import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { StudyPlansRepository } from '../../domain/repositories/study-plans.repository';
import { StudyPlanMapper } from '../prisma/study-plan.mapper';

@Injectable()
export class PrismaStudyPlansRepository
  extends PrismaRepository
  implements StudyPlansRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(plan: StudyPlanEntity): Promise<StudyPlanEntity> {
    const created = await this.prisma.studyPlan.create({
      data: {
        id: plan.id,
        userId: plan.userId,
        groupId: plan.groupId,
        title: plan.title,
        createdAt: plan.createdAt,
      },
    });
    return StudyPlanMapper.toDomain(created);
  }

  async findById(id: string): Promise<StudyPlanEntity | null> {
    const plan = await this.prisma.studyPlan.findUnique({ where: { id } });
    return plan ? StudyPlanMapper.toDomain(plan) : null;
  }

  async findByUser(
    userId: string,
    pagination: PaginationParams,
  ): Promise<StudyPlanEntity[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const plans = await this.prisma.studyPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return plans.map(StudyPlanMapper.toDomain);
  }

  async countByUser(userId: string): Promise<number> {
    return this.prisma.studyPlan.count({ where: { userId } });
  }

  async update(plan: StudyPlanEntity): Promise<StudyPlanEntity> {
    const updated = await this.prisma.studyPlan.update({
      where: { id: plan.id },
      data: { title: plan.title },
    });
    return StudyPlanMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.studyPlan.delete({ where: { id } });
  }
}
