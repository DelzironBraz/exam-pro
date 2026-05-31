export class ParsedStudyPlanItemEntity {
  constructor(
    readonly title: string,
    readonly description: string,
    readonly estimatedHours: number,
  ) {}
}

export class ParsedStudyPlanEntity {
  constructor(
    readonly title: string,
    readonly items: ParsedStudyPlanItemEntity[],
  ) {}
}
