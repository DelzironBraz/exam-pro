export class SimulationAttemptEntity {
  constructor(
    readonly id: string,
    readonly simulationId: string,
    readonly userId: string,
    readonly startedAt: Date,
    readonly finishedAt: Date | null,
    readonly totalCorrect: number,
    readonly totalWrong: number,
    readonly totalTimeSeconds: number,
  ) {}
}
