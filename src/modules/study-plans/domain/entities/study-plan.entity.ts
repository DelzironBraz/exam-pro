export class StudyPlanEntity {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly groupId: string,
    readonly title: string,
    readonly createdAt: Date,
  ) {}
}
