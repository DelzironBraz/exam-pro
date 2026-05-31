import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';

export class AlternativeResponse {
  id: string;
  label: string;
  content: string;
  isCorrect?: boolean;

  constructor(alternative: AlternativeEntity, revealCorrect = false) {
    this.id = alternative.id;
    this.label = alternative.label;
    this.content = alternative.content;
    if (revealCorrect) {
      this.isCorrect = alternative.isCorrect;
    }
  }
}

export class QuestionResponse {
  id: string;
  statement: string;
  groupId: string;
  discipline: string | null;
  topic: string | null;
  difficulty: DifficultyLevel;
  explanation?: string;
  createdBy: string;
  createdAt: Date;
  tags: string[];
  alternatives?: AlternativeResponse[];

  constructor(
    question: QuestionEntity,
    options?: {
      tags?: string[];
      alternatives?: AlternativeEntity[];
      revealCorrect?: boolean;
      includeExplanation?: boolean;
    },
  ) {
    this.id = question.id;
    this.statement = question.statement;
    this.groupId = question.groupId;
    this.discipline = question.discipline;
    this.topic = question.topic;
    this.difficulty = question.difficulty;
    this.createdBy = question.createdBy;
    this.createdAt = question.createdAt;
    this.tags = options?.tags ?? [];

    if (options?.includeExplanation && question.explanation) {
      this.explanation = question.explanation;
    }

    if (options?.alternatives) {
      this.alternatives = options.alternatives.map(
        (alt) => new AlternativeResponse(alt, options.revealCorrect ?? false),
      );
    }
  }

  static fromSummary(question: QuestionEntity, tags: string[] = []): QuestionResponse {
    return new QuestionResponse(question, { tags });
  }

  static fromDetail(
    question: QuestionEntity,
    alternatives: AlternativeEntity[],
    tags: string[],
    revealCorrect: boolean,
  ): QuestionResponse {
    return new QuestionResponse(question, {
      tags,
      alternatives,
      revealCorrect,
      includeExplanation: revealCorrect,
    });
  }
}

export class ListQuestionsResponse {
  items: QuestionResponse[];
  total: number;

  constructor(items: QuestionEntity[], total: number, tagsByQuestionId?: Map<string, string[]>) {
    this.items = items.map((q) =>
      QuestionResponse.fromSummary(q, tagsByQuestionId?.get(q.id) ?? []),
    );
    this.total = total;
  }
}
