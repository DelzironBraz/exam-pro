import { AlternativeEntity } from '../../../modules/questions/domain/entities/alternative.entity';
import { QuestionEntity } from '../../../modules/questions/domain/entities/question.entity';

export interface AssessmentQuestionAnswerState {
  selectedAlternativeId: string;
  answeredAt: Date;
}

export interface AssessmentQuestionItem {
  sortOrder: number;
  sectionId?: string | null;
  question: QuestionEntity;
  alternatives: AlternativeEntity[];
  answered: boolean;
  answer?: AssessmentQuestionAnswerState;
}
