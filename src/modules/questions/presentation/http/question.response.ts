import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { ListQuestionItem } from '../../application/types/list-question-item.type';

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
  answers?: AlternativeResponse[];
  completed?: boolean;
  lastAnswer?: {
    selectedAlternativeId: string;
    isCorrect: boolean;
    answeredAt: Date;
    correctAlternativeId?: string;
  };

  constructor(
    question: QuestionEntity,
    options?: {
      tags?: string[];
      alternatives?: AlternativeEntity[];
      revealCorrect?: boolean;
      includeExplanation?: boolean;
      completed?: boolean;
      lastAnswer?: ListQuestionItem['lastAnswer'];
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
      const revealCorrect = options.revealCorrect ?? false;
      const mapped = options.alternatives.map(
        (alt) => new AlternativeResponse(alt, revealCorrect),
      );
      this.alternatives = mapped;
      this.answers = mapped;
    }

    if (options?.completed !== undefined) {
      this.completed = options.completed;
    }

    if (options?.lastAnswer) {
      this.lastAnswer = options.lastAnswer;
    }
  }

  static fromSummary(question: QuestionEntity, tags: string[] = []): QuestionResponse {
    return new QuestionResponse(question, { tags });
  }

  static fromListItem(item: ListQuestionItem): QuestionResponse {
    return new QuestionResponse(item.question, {
      tags: item.tags,
      alternatives: item.alternatives,
      revealCorrect: item.completed,
      includeExplanation: item.completed,
      completed: item.completed,
      lastAnswer: item.lastAnswer,
    });
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

