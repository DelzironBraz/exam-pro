export class AlternativeEntity {
  constructor(
    readonly id: string,
    readonly questionId: string,
    readonly label: string,
    readonly content: string,
    readonly isCorrect: boolean,
  ) {}
}
