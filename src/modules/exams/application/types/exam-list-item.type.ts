import { ExamEntity } from '../../domain/entities/exam.entity';

export interface ExamListItem {
  exam: ExamEntity;
  totalQuestions: number;
}
