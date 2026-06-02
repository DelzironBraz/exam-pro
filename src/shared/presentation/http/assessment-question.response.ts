import { AlternativeEntity } from '../../../modules/questions/domain/entities/alternative.entity';
import { QuestionEntity } from '../../../modules/questions/domain/entities/question.entity';
import { DifficultyLevel } from '../../../modules/questions/domain/enums/difficulty-level.enum';
import { QuestionType } from '../../../modules/questions/domain/enums/question-type.enum';
import { AssessmentQuestionItem } from '../../application/types/assessment-question-item.type';

class AssessmentAlternativeResponse {
  id: string;
  label: string;
  content: string;

  constructor(alternative: AlternativeEntity) {
    this.id = alternative.id;
    this.label = alternative.label;
    this.content = alternative.content;
  }
}

class AssessmentQuestionDetailResponse {
  id: string;
  statement: string;
  discipline: string | null;
  topic: string | null;
  difficulty: DifficultyLevel;
  type: QuestionType;

  constructor(question: QuestionEntity) {
    this.id = question.id;
    this.statement = question.statement;
    this.discipline = question.discipline;
    this.topic = question.topic;
    this.difficulty = question.difficulty;
    this.type = question.type;
  }
}

export class AssessmentQuestionResponse {
  sortOrder: number;
  sectionId?: string | null;
  question: AssessmentQuestionDetailResponse;
  alternatives: AssessmentAlternativeResponse[];
  answers: AssessmentAlternativeResponse[];
  answered: boolean;
  selectedAlternativeId?: string | null;
  textAnswer?: string | null;
  similarityScore?: number | null;
  answeredAt?: Date;

  constructor(item: AssessmentQuestionItem) {
    this.sortOrder = item.sortOrder;
    this.sectionId = item.sectionId;
    this.question = new AssessmentQuestionDetailResponse(item.question);
    this.alternatives = item.alternatives.map(
      (alternative) => new AssessmentAlternativeResponse(alternative),
    );
    this.answers = this.alternatives;
    this.answered = item.answered;

    if (item.answer) {
      this.selectedAlternativeId = item.answer.selectedAlternativeId;
      this.textAnswer = item.answer.textAnswer;
      this.similarityScore = item.answer.similarityScore;
      this.answeredAt = item.answer.answeredAt;
    }
  }
}
