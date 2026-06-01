import { FlashcardEntity } from '../../domain/entities/flashcard.entity';

export class FlashcardResponse {
  id: string;
  groupId: string;
  frontContent: string;
  backContent: string;
  difficulty: number;
  createdBy: string;
  createdAt: Date;

  constructor(flashcard: FlashcardEntity) {
    this.id = flashcard.id;
    this.groupId = flashcard.groupId;
    this.frontContent = flashcard.frontContent;
    this.backContent = flashcard.backContent;
    this.difficulty = flashcard.difficulty;
    this.createdBy = flashcard.createdBy;
    this.createdAt = flashcard.createdAt;
  }

  static from(flashcard: FlashcardEntity): FlashcardResponse {
    return new FlashcardResponse(flashcard);
  }

  static fromList(flashcards: FlashcardEntity[]): FlashcardResponse[] {
    return flashcards.map((card) => FlashcardResponse.from(card));
  }
}

/** Frente do card apenas — para revisão sem spoiler do verso. */
export class FlashcardStudyResponse {
  id: string;
  groupId: string;
  frontContent: string;
  difficulty: number;

  constructor(flashcard: FlashcardEntity) {
    this.id = flashcard.id;
    this.groupId = flashcard.groupId;
    this.frontContent = flashcard.frontContent;
    this.difficulty = flashcard.difficulty;
  }

  static from(flashcard: FlashcardEntity): FlashcardStudyResponse {
    return new FlashcardStudyResponse(flashcard);
  }

  static fromList(flashcards: FlashcardEntity[]): FlashcardStudyResponse[] {
    return flashcards.map((card) => new FlashcardStudyResponse(card));
  }
}
