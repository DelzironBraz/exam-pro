export class QuestionAnswerEntity {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly questionId: string,
    readonly selectedAlternativeId: string,
    readonly timeSpentSeconds: number,
    readonly isCorrect: boolean,
    readonly createdAt: Date,
  ) {}
}
