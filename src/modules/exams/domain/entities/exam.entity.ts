export class ExamEntity {
  constructor(
    readonly id: string,
    readonly groupId: string,
    readonly title: string,
    readonly institution: string,
    readonly organization: string,
    readonly year: number,
    readonly roleName: string,
    readonly durationMinutes: number,
    readonly createdAt: Date,
  ) {}
}
