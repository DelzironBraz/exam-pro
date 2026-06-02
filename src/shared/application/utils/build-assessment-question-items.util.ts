import { AssessmentQuestionItem } from '../types/assessment-question-item.type';
import { AlternativeEntity } from '../../../modules/questions/domain/entities/alternative.entity';
import { QuestionEntity } from '../../../modules/questions/domain/entities/question.entity';

export interface QuestionLinkRow {
  questionId: string;
  sortOrder: number;
  sectionId?: string | null;
}

export interface AttemptAnswerRow {
  questionId: string;
  selectedAlternativeId: string;
  answeredAt: Date;
}

export function buildAssessmentQuestionItems(
  links: QuestionLinkRow[],
  questions: QuestionEntity[],
  alternativesByQuestionId: Map<string, AlternativeEntity[]>,
  answersByQuestionId: Map<string, AttemptAnswerRow>,
): AssessmentQuestionItem[] {
  const questionsById = new Map(questions.map((question) => [question.id, question]));
  const items: AssessmentQuestionItem[] = [];

  for (const link of links) {
    const question = questionsById.get(link.questionId);
    if (!question) {
      continue;
    }

    const answer = answersByQuestionId.get(link.questionId);

    items.push({
      sortOrder: link.sortOrder,
      sectionId: link.sectionId,
      question,
      alternatives: alternativesByQuestionId.get(link.questionId) ?? [],
      answered: answer !== undefined,
      answer: answer
        ? {
            selectedAlternativeId: answer.selectedAlternativeId,
            answeredAt: answer.answeredAt,
          }
        : undefined,
    });
  }

  return items;
}
