export class FlashcardEntity {
  constructor(
    readonly id: string,
    readonly groupId: string,
    readonly frontContent: string,
    readonly backContent: string,
    readonly difficulty: number,
    readonly createdBy: string,
    readonly createdAt: Date,
  ) {}
}
