import { ParsedAlternativeEntity } from './parsed-alternative.entity';

export class ParsedQuestionEntity {
  constructor(
    readonly statement: string,
    readonly alternatives: ParsedAlternativeEntity[],
    readonly discipline?: string,
    readonly topic?: string,
  ) {}
}
