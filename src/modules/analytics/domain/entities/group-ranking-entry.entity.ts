export class GroupRankingEntryEntity {
  constructor(
    readonly userId: string,
    readonly totalAnswers: number,
    readonly accuracy: number,
    readonly rank: number,
  ) {}
}
