import { StudyPlan as PrismaStudyPlan } from '../../../../generated/prisma';
import { StudyPlanEntity } from '../../domain/entities/study-plan.entity';

export class StudyPlanMapper {
  static toDomain(record: PrismaStudyPlan): StudyPlanEntity {
    return new StudyPlanEntity(
      record.id,
      record.userId,
      record.groupId,
      record.title,
      record.createdAt,
    );
  }
}
