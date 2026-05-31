import { QuestionAnswerEntity } from '../entities/question-answer.entity';

export abstract class QuestionAnswersRepository {
  abstract create(answer: QuestionAnswerEntity): Promise<QuestionAnswerEntity>;
}

export const QUESTION_ANSWERS_REPOSITORY = Symbol('QUESTION_ANSWERS_REPOSITORY');
