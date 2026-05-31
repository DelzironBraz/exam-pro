import { FlashcardEntity } from '../entities/flashcard.entity';

export abstract class FlashcardsRepository {
  abstract create(flashcard: FlashcardEntity): Promise<FlashcardEntity>;

  abstract findById(id: string): Promise<FlashcardEntity | null>;

  abstract findManyByGroup(groupId: string): Promise<FlashcardEntity[]>;

  abstract update(flashcard: FlashcardEntity): Promise<FlashcardEntity>;

  abstract delete(id: string): Promise<void>;
}

export const FLASHCARDS_REPOSITORY = Symbol('FLASHCARDS_REPOSITORY');
