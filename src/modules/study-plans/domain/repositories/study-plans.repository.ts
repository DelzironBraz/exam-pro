import { StudyPlanEntity } from '../entities/study-plan.entity';

export abstract class StudyPlansRepository {
  abstract create(plan: StudyPlanEntity): Promise<StudyPlanEntity>;

  abstract findById(id: string): Promise<StudyPlanEntity | null>;

  abstract findByUser(userId: string): Promise<StudyPlanEntity[]>;

  abstract update(plan: StudyPlanEntity): Promise<StudyPlanEntity>;

  abstract delete(id: string): Promise<void>;
}

export const STUDY_PLANS_REPOSITORY = Symbol('STUDY_PLANS_REPOSITORY');
