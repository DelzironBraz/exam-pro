import { Injectable } from '@nestjs/common';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';
import { StudyPlanItemsRepository } from '../../domain/repositories/study-plan-items.repository';
import { StudyPlanItemMapper } from '../prisma/study-plan-item.mapper';

@Injectable()
export class PrismaStudyPlanItemsRepository
  extends PrismaRepository
  implements StudyPlanItemsRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async createMany(items: StudyPlanItemEntity[]): Promise<void> {
    if (items.length === 0) {
      return;
    }

    await this.prisma.studyPlanItem.createMany({
      data: items.map((item) => ({
        id: item.id,
        studyPlanId: item.studyPlanId,
        title: item.title,
        description: item.description,
        estimatedHours: item.estimatedHours,
        sortOrder: item.order,
        completed: item.completed,
      })),
    });
  }

  async findByPlan(planId: string): Promise<StudyPlanItemEntity[]> {
    const items = await this.prisma.studyPlanItem.findMany({
      where: { studyPlanId: planId },
      orderBy: { sortOrder: 'asc' },
    });
    return items.map(StudyPlanItemMapper.toDomain);
  }

  async findById(itemId: string): Promise<StudyPlanItemEntity | null> {
    const item = await this.prisma.studyPlanItem.findUnique({ where: { id: itemId } });
    return item ? StudyPlanItemMapper.toDomain(item) : null;
  }

  async getNextOrder(planId: string): Promise<number> {
    const last = await this.prisma.studyPlanItem.findFirst({
      where: { studyPlanId: planId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });
    return (last?.sortOrder ?? -1) + 1;
  }

  async markAsCompleted(itemId: string): Promise<void> {
    await this.prisma.studyPlanItem.update({
      where: { id: itemId },
      data: { completed: true },
    });
  }
}
