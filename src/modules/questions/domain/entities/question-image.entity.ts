export class QuestionImageEntity {
  constructor(
    readonly id: string,
    readonly questionId: string,
    readonly url: string,
    readonly sortOrder: number,
  ) {}
}
