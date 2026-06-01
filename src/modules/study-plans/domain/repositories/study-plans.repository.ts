import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { StudyPlanEntity } from '../entities/study-plan.entity';

export abstract class StudyPlansRepository {
  abstract create(plan: StudyPlanEntity): Promise<StudyPlanEntity>;

  abstract findById(id: string): Promise<StudyPlanEntity | null>;

  abstract findByUser(
    userId: string,
    pagination: PaginationParams,
  ): Promise<StudyPlanEntity[]>;

  abstract countByUser(userId: string): Promise<number>;

  abstract update(plan: StudyPlanEntity): Promise<StudyPlanEntity>;

  abstract delete(id: string): Promise<void>;
}

export const STUDY_PLANS_REPOSITORY = Symbol('STUDY_PLANS_REPOSITORY');
