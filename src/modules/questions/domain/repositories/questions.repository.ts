import { QuestionEntity } from '../entities/question.entity';
import { DifficultyLevel } from '../enums/difficulty-level.enum';

export interface QuestionFilters {
  groupId?: string;
  discipline?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  tags?: string[];
}

export abstract class QuestionsRepository {
  abstract create(question: QuestionEntity): Promise<QuestionEntity>;

  abstract findById(id: string): Promise<QuestionEntity | null>;

  abstract update(question: QuestionEntity): Promise<QuestionEntity>;

  abstract delete(id: string): Promise<void>;

  abstract findMany(filters: QuestionFilters): Promise<QuestionEntity[]>;

  abstract count(filters: QuestionFilters): Promise<number>;
}

export const QUESTIONS_REPOSITORY = Symbol('QUESTIONS_REPOSITORY');
