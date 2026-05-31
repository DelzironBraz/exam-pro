export class FlashcardReviewEntity {
  constructor(
    readonly id: string,
    readonly flashcardId: string,
    readonly userId: string,
    readonly score: number,
    readonly reviewedAt: Date,
  ) {}
}
