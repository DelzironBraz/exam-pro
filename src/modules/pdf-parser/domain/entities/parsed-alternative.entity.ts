export class ParsedAlternativeEntity {
  constructor(
    readonly label: string,
    readonly content: string,
    readonly isCorrect: boolean,
  ) {}
}
