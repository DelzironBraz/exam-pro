import { ExamAttemptAnswerEntity } from '../entities/exam-attempt-answer.entity';

export abstract class ExamAttemptAnswersRepository {
  abstract upsert(answer: ExamAttemptAnswerEntity): Promise<ExamAttemptAnswerEntity>;

  abstract findByAttemptId(attemptId: string): Promise<ExamAttemptAnswerEntity[]>;

  abstract countByAttemptId(attemptId: string): Promise<{
    correct: number;
    wrong: number;
    totalTimeSeconds: number;
  }>;
}

export const EXAM_ATTEMPT_ANSWERS_REPOSITORY = Symbol('EXAM_ATTEMPT_ANSWERS_REPOSITORY');
