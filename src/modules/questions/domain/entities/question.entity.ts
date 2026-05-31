import { DifficultyLevel } from '../enums/difficulty-level.enum';

export class QuestionEntity {
  constructor(
    readonly id: string,
    readonly statement: string,
    readonly groupId: string,
    readonly discipline: string | null,
    readonly topic: string | null,
    readonly difficulty: DifficultyLevel,
    readonly explanation: string | null,
    readonly createdBy: string,
    readonly createdAt: Date,
  ) {}
}
