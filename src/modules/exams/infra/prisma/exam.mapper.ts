import { Exam as PrismaExam } from '../../../../generated/prisma';
import { ExamEntity } from '../../domain/entities/exam.entity';

export class ExamMapper {
  static toDomain(record: PrismaExam): ExamEntity {
    return new ExamEntity(
      record.id,
      record.groupId,
      record.title,
      record.institution,
      record.organization,
      record.year,
      record.roleName,
      record.durationMinutes,
      record.createdAt,
    );
  }
}
