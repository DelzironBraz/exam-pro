import { QuestionType } from '../../domain/enums/question-type.enum';

export interface AlternativeInput {
  label: string;
  content: string;
  isCorrect: boolean;
}

export function validateQuestionInput(input: {
  type: QuestionType;
  alternatives: AlternativeInput[];
  referenceAnswer?: string;
}): string | null {
  if (input.type === QuestionType.DISCURSIVE) {
    if (!input.referenceAnswer?.trim()) {
      return 'referenceAnswer is required for discursive questions';
    }
    if (input.alternatives.length > 0) {
      return 'Discursive questions cannot have alternatives';
    }
    return null;
  }

  return validateAlternatives(input.alternatives);
}

export function validateAlternatives(alternatives: AlternativeInput[]): string | null {
  if (alternatives.length < 2) {
    return 'At least two alternatives are required';
  }

  const labels = alternatives.map((a) => a.label.trim().toLowerCase());
  if (new Set(labels).size !== labels.length) {
    return 'Alternative labels must be unique';
  }

  const correctCount = alternatives.filter((a) => a.isCorrect).length;
  if (correctCount !== 1) {
    return 'Exactly one alternative must be marked as correct';
  }

  return null;
}
