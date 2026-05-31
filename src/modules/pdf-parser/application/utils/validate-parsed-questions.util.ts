import { ParsedQuestionEntity } from '../../domain/entities/parsed-question.entity';

export interface ParsedQuestionValidationIssue {
  questionIndex: number;
  message: string;
}

export interface ParsedQuestionsValidationResult {
  valid: boolean;
  issues: ParsedQuestionValidationIssue[];
}

export function validateParsedQuestions(
  questions: ParsedQuestionEntity[],
): ParsedQuestionsValidationResult {
  const issues: ParsedQuestionValidationIssue[] = [];

  if (questions.length === 0) {
    issues.push({ questionIndex: -1, message: 'No questions were parsed from the PDF' });
    return { valid: false, issues };
  }

  questions.forEach((question, index) => {
    if (!question.statement.trim()) {
      issues.push({ questionIndex: index, message: 'Statement is empty' });
    }

    if (question.alternatives.length < 2) {
      issues.push({
        questionIndex: index,
        message: 'At least two alternatives are required',
      });
    }

    const correctCount = question.alternatives.filter((a) => a.isCorrect).length;
    if (correctCount !== 1) {
      issues.push({
        questionIndex: index,
        message: 'Exactly one alternative must be marked as correct (or add manually before approve)',
      });
    }

    const labels = question.alternatives.map((a) => a.label.toLowerCase());
    if (new Set(labels).size !== labels.length) {
      issues.push({ questionIndex: index, message: 'Duplicate alternative labels' });
    }
  });

  return { valid: issues.length === 0, issues };
}
