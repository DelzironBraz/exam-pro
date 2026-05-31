export interface AlternativeInput {
  label: string;
  content: string;
  isCorrect: boolean;
}

const DISSERTATIVE_DISCIPLINE_PREFIX = 'Direito ';

export function isDissertativeDiscipline(discipline?: string | null): boolean {
  if (!discipline?.trim()) {
    return false;
  }
  return discipline.trim().startsWith(DISSERTATIVE_DISCIPLINE_PREFIX);
}

export function validateAlternatives(
  alternatives: AlternativeInput[],
  options?: { allowDissertative?: boolean },
): string | null {
  if (alternatives.length === 0) {
    return options?.allowDissertative ? null : 'At least two alternatives are required';
  }

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
