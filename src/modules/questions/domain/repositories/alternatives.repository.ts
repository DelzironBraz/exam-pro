import { AlternativeEntity } from '../entities/alternative.entity';

export abstract class AlternativesRepository {
  abstract createMany(alternatives: AlternativeEntity[]): Promise<void>;

  abstract findByQuestionId(questionId: string): Promise<AlternativeEntity[]>;

  abstract deleteByQuestionId(questionId: string): Promise<void>;
}

export const ALTERNATIVES_REPOSITORY = Symbol('ALTERNATIVES_REPOSITORY');
