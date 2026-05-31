import { StudyPlanItem as PrismaStudyPlanItem } from '../../../../generated/prisma';
import { StudyPlanItemEntity } from '../../domain/entities/study-plan-item.entity';

export class StudyPlanItemMapper {
  static toDomain(record: PrismaStudyPlanItem): StudyPlanItemEntity {
    return new StudyPlanItemEntity(
      record.id,
      record.studyPlanId,
      record.title,
      record.description,
      record.estimatedHours,
      record.sortOrder,
      record.completed,
    );
  }
}
