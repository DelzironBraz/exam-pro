export class ExamSectionEntity {
  constructor(
    readonly id: string,
    readonly examId: string,
    readonly name: string,
    readonly weight: number,
    readonly order: number,
  ) {}
}
