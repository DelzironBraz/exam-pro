import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { QuestionType } from '../../domain/enums/question-type.enum';

/** Score mínimo (0–1) para considerar uma resposta discursiva correta. */
export const DISCURSIVE_CORRECTNESS_THRESHOLD = 0.72;

export interface AnswerPayloadInput {
  selectedAlternativeId?: string;
  textAnswer?: string;
}

export interface EvaluatedQuestionAnswer {
  isCorrect: boolean;
  selectedAlternativeId: string | null;
  textAnswer: string | null;
  similarityScore: number | null;
  correctAlternativeId?: string;
  referenceAnswer?: string;
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) {
    return [];
  }
  return normalized.split(' ').filter(Boolean);
}

function jaccardSimilarity(left: string[], right: string[]): number {
  if (left.length === 0 && right.length === 0) {
    return 1;
  }
  if (left.length === 0 || right.length === 0) {
    return 0;
  }

  const leftSet = new Set(left);
  const rightSet = new Set(right);
  let intersection = 0;

  for (const token of leftSet) {
    if (rightSet.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...leftSet, ...rightSet]).size;
  return union === 0 ? 0 : intersection / union;
}

function levenshteinDistance(left: string, right: string): number {
  if (left === right) {
    return 0;
  }
  if (left.length === 0) {
    return right.length;
  }
  if (right.length === 0) {
    return left.length;
  }

  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  const current = new Array<number>(right.length + 1);

  for (let i = 1; i <= left.length; i += 1) {
    current[0] = i;

    for (let j = 1; j <= right.length; j += 1) {
      const substitutionCost = left[i - 1] === right[j - 1] ? 0 : 1;
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + substitutionCost,
      );
    }

    for (let j = 0; j <= right.length; j += 1) {
      previous[j] = current[j];
    }
  }

  return previous[right.length];
}

function levenshteinRatio(left: string, right: string): number {
  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) {
    return 1;
  }

  return 1 - levenshteinDistance(left, right) / maxLength;
}

function tokenRecall(referenceTokens: string[], userTokens: string[]): number {
  if (referenceTokens.length === 0) {
    return userTokens.length === 0 ? 1 : 0;
  }

  const userSet = new Set(userTokens);
  const matched = referenceTokens.filter((token) => userSet.has(token)).length;
  return matched / referenceTokens.length;
}

export function computeTextSimilarity(userAnswer: string, referenceAnswer: string): number {
  const normalizedUser = normalizeText(userAnswer);
  const normalizedReference = normalizeText(referenceAnswer);

  if (!normalizedUser || !normalizedReference) {
    return 0;
  }

  if (normalizedUser === normalizedReference) {
    return 1;
  }

  const userTokens = tokenize(normalizedUser);
  const referenceTokens = tokenize(normalizedReference);

  const jaccard = jaccardSimilarity(userTokens, referenceTokens);
  const levenshtein = levenshteinRatio(normalizedUser, normalizedReference);
  const recall = tokenRecall(referenceTokens, userTokens);

  const score = jaccard * 0.5 + levenshtein * 0.3 + recall * 0.2;
  return Math.min(1, Math.max(0, Number(score.toFixed(4))));
}

export function validateAnswerPayload(
  question: QuestionEntity,
  input: AnswerPayloadInput,
): string | null {
  const hasAlternative = Boolean(input.selectedAlternativeId?.trim());
  const hasText = Boolean(input.textAnswer?.trim());

  if (question.type === QuestionType.DISCURSIVE) {
    if (hasAlternative) {
      return 'Discursive questions must be answered with textAnswer';
    }
    if (!hasText) {
      return 'textAnswer is required for discursive questions';
    }
    if (!question.referenceAnswer?.trim()) {
      return 'Question has no reference answer configured';
    }
    return null;
  }

  if (hasText) {
    return 'Multiple choice questions must be answered with selectedAlternativeId';
  }
  if (!hasAlternative) {
    return 'selectedAlternativeId is required for multiple choice questions';
  }

  return null;
}

export function evaluateQuestionAnswer(input: {
  question: QuestionEntity;
  alternatives: AlternativeEntity[];
  selectedAlternativeId?: string;
  textAnswer?: string;
}): EvaluatedQuestionAnswer {
  const { question, alternatives } = input;

  if (question.type === QuestionType.DISCURSIVE) {
    const trimmedAnswer = input.textAnswer!.trim();
    const referenceAnswer = question.referenceAnswer!.trim();
    const similarityScore = computeTextSimilarity(trimmedAnswer, referenceAnswer);

    return {
      isCorrect: similarityScore >= DISCURSIVE_CORRECTNESS_THRESHOLD,
      selectedAlternativeId: null,
      textAnswer: trimmedAnswer,
      similarityScore,
      referenceAnswer,
    };
  }

  const correct = alternatives.find((alternative) => alternative.isCorrect);
  const selectedAlternativeId = input.selectedAlternativeId!;

  return {
    isCorrect: correct?.id === selectedAlternativeId,
    selectedAlternativeId,
    textAnswer: null,
    similarityScore: null,
    correctAlternativeId: correct?.id,
  };
}
