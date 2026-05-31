import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';
import { GetStudyPlanOutput } from '../../application/use-cases/get-study-plan.use-case';

export class StudyPlanItemResponse {
  id: string;
  studyPlanId: string;
  title: string;
  description: string;
  estimatedHours: number;
  order: number;
  completed: boolean;

  constructor(item: StudyPlanItemEntity) {
    this.id = item.id;
    this.studyPlanId = item.studyPlanId;
    this.title = item.title;
    this.description = item.description;
    this.estimatedHours = item.estimatedHours;
    this.order = item.order;
    this.completed = item.completed;
  }

  static from(item: StudyPlanItemEntity): StudyPlanItemResponse {
    return new StudyPlanItemResponse(item);
  }

  static fromList(items: StudyPlanItemEntity[]): StudyPlanItemResponse[] {
    return items.map((item) => StudyPlanItemResponse.from(item));
  }
}

export class StudyPlanProgressResponse {
  totalItems: number;
  completedItems: number;
  totalEstimatedHours: number;
  completedEstimatedHours: number;
  completionPercent: number;

  constructor(progress: GetStudyPlanOutput['progress']) {
    this.totalItems = progress.totalItems;
    this.completedItems = progress.completedItems;
    this.totalEstimatedHours = progress.totalEstimatedHours;
    this.completedEstimatedHours = progress.completedEstimatedHours;
    this.completionPercent =
      progress.totalItems > 0
        ? Math.round((progress.completedItems / progress.totalItems) * 100)
        : 0;
  }
}

export class StudyPlanResponse {
  id: string;
  userId: string;
  groupId: string;
  title: string;
  createdAt: Date;
  items?: StudyPlanItemResponse[];
  progress?: StudyPlanProgressResponse;

  constructor(
    plan: StudyPlanEntity,
    options?: {
      items?: StudyPlanItemEntity[];
      progress?: GetStudyPlanOutput['progress'];
    },
  ) {
    this.id = plan.id;
    this.userId = plan.userId;
    this.groupId = plan.groupId;
    this.title = plan.title;
    this.createdAt = plan.createdAt;

    if (options?.items) {
      this.items = StudyPlanItemResponse.fromList(options.items);
    }

    if (options?.progress) {
      this.progress = new StudyPlanProgressResponse(options.progress);
    }
  }

  static from(plan: StudyPlanEntity): StudyPlanResponse {
    return new StudyPlanResponse(plan);
  }

  static fromDetail(output: GetStudyPlanOutput): StudyPlanResponse {
    return new StudyPlanResponse(output.plan, {
      items: output.items,
      progress: output.progress,
    });
  }

  static fromList(plans: StudyPlanEntity[]): StudyPlanResponse[] {
    return plans.map((plan) => StudyPlanResponse.from(plan));
  }
}
