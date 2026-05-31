import { StudyPlanItemEntity } from '../entities/study-plan-item.entity';

export abstract class StudyPlanItemsRepository {
  abstract createMany(items: StudyPlanItemEntity[]): Promise<void>;

  abstract findByPlan(planId: string): Promise<StudyPlanItemEntity[]>;

  abstract findById(itemId: string): Promise<StudyPlanItemEntity | null>;

  abstract getNextOrder(planId: string): Promise<number>;

  abstract markAsCompleted(itemId: string): Promise<void>;
}

export const STUDY_PLAN_ITEMS_REPOSITORY = Symbol('STUDY_PLAN_ITEMS_REPOSITORY');
