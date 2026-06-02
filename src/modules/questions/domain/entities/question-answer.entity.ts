export class QuestionAnswerEntity {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly questionId: string,
    readonly selectedAlternativeId: string | null,
    readonly textAnswer: string | null,
    readonly similarityScore: number | null,
    readonly timeSpentSeconds: number,
    readonly isCorrect: boolean,
    readonly createdAt: Date,
  ) {}
}
