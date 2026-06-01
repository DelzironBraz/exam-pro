import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { ExamAttemptEntity } from '../entities/exam-attempt.entity';

export interface FinishExamInput {
  attemptId: string;
  totalCorrect: number;
  totalWrong: number;
  totalTimeSeconds: number;
  score: number;
}

export abstract class ExamAttemptsRepository {
  abstract create(attempt: ExamAttemptEntity): Promise<ExamAttemptEntity>;

  abstract findById(id: string): Promise<ExamAttemptEntity | null>;

  abstract finish(attemptId: string, result: FinishExamInput): Promise<ExamAttemptEntity>;

  abstract findByUser(
    userId: string,
    pagination: PaginationParams,
  ): Promise<ExamAttemptEntity[]>;

  abstract countByUser(userId: string): Promise<number>;

  abstract findByUserAndExam(userId: string, examId: string): Promise<ExamAttemptEntity[]>;
}

export const EXAM_ATTEMPTS_REPOSITORY = Symbol('EXAM_ATTEMPTS_REPOSITORY');
