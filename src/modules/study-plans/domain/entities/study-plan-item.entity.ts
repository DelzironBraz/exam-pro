export class StudyPlanItemEntity {
  constructor(
    readonly id: string,
    readonly studyPlanId: string,
    readonly title: string,
    readonly description: string,
    readonly estimatedHours: number,
    readonly order: number,
    readonly completed: boolean,
  ) {}
}
