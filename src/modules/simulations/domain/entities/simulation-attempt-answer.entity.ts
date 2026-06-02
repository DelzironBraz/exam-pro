export class SimulationAttemptAnswerEntity {
  constructor(
    readonly id: string,
    readonly attemptId: string,
    readonly questionId: string,
    readonly selectedAlternativeId: string | null,
    readonly textAnswer: string | null,
    readonly similarityScore: number | null,
    readonly timeSpentSeconds: number,
    readonly isCorrect: boolean,
    readonly answeredAt: Date,
  ) {}
}
