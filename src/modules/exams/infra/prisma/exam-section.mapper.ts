import { ExamSection as PrismaExamSection } from '../../../../generated/prisma';
import { ExamSectionEntity } from '../../domain/entities/exam-section.entity';

export class ExamSectionMapper {
  static toDomain(record: PrismaExamSection): ExamSectionEntity {
    return new ExamSectionEntity(
      record.id,
      record.examId,
      record.name,
      record.weight,
      record.sortOrder,
    );
  }
}
