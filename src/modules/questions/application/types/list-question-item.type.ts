import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';

export interface ListQuestionLastAnswer {
  selectedAlternativeId?: string | null;
  textAnswer?: string | null;
  similarityScore?: number | null;
  isCorrect: boolean;
  answeredAt: Date;
  correctAlternativeId?: string;
  referenceAnswer?: string;
}

export interface ListQuestionItem {
  question: QuestionEntity;
  alternatives: AlternativeEntity[];
  tags: string[];
  completed: boolean;
  lastAnswer?: ListQuestionLastAnswer;
}
