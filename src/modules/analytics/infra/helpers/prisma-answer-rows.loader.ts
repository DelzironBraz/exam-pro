import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { AnswerStatRow } from './answer-stats.helper';

export async function loadUserAnswerRows(
  prisma: PrismaService,
  userId: string,
): Promise<AnswerStatRow[]> {
  const [questionAnswers, simulationAnswers, examAnswers] = await Promise.all([
    prisma.questionAnswer.findMany({
      where: { userId },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
    prisma.simulationAttemptAnswer.findMany({
      where: { attempt: { userId } },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
    prisma.examAttemptAnswer.findMany({
      where: { attempt: { userId } },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
  ]);

  return [
    ...questionAnswers.map((row) => toAnswerStatRow(row)),
    ...simulationAnswers.map((row) => toAnswerStatRow(row)),
    ...examAnswers.map((row) => toAnswerStatRow(row)),
  ];
}

export async function loadGroupAnswerRows(
  prisma: PrismaService,
  groupId: string,
): Promise<AnswerStatRow[]> {
  const questionFilter = { question: { groupId } };

  const [questionAnswers, simulationAnswers, examAnswers] = await Promise.all([
    prisma.questionAnswer.findMany({
      where: questionFilter,
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        userId: true,
        question: { select: { topic: true } },
      },
    }),
    prisma.simulationAttemptAnswer.findMany({
      where: questionFilter,
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        attempt: { select: { userId: true } },
        question: { select: { topic: true } },
      },
    }),
    prisma.examAttemptAnswer.findMany({
      where: questionFilter,
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        attempt: { select: { userId: true } },
        question: { select: { topic: true } },
      },
    }),
  ]);

  return [
    ...questionAnswers.map((row) =>
      toAnswerStatRow(row, row.userId),
    ),
    ...simulationAnswers.map((row) =>
      toAnswerStatRow(row, row.attempt.userId),
    ),
    ...examAnswers.map((row) =>
      toAnswerStatRow(row, row.attempt.userId),
    ),
  ];
}

export async function loadQuestionAnswerRows(
  prisma: PrismaService,
  questionId: string,
): Promise<AnswerStatRow[]> {
  const [questionAnswers, simulationAnswers, examAnswers] = await Promise.all([
    prisma.questionAnswer.findMany({
      where: { questionId },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
    prisma.simulationAttemptAnswer.findMany({
      where: { questionId },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
    prisma.examAttemptAnswer.findMany({
      where: { questionId },
      select: {
        isCorrect: true,
        timeSpentSeconds: true,
        question: { select: { topic: true } },
      },
    }),
  ]);

  return [
    ...questionAnswers.map((row) => toAnswerStatRow(row)),
    ...simulationAnswers.map((row) => toAnswerStatRow(row)),
    ...examAnswers.map((row) => toAnswerStatRow(row)),
  ];
}

function toAnswerStatRow(
  row: {
    isCorrect: boolean;
    timeSpentSeconds: number;
    question: { topic: string | null };
  },
  userId?: string,
): AnswerStatRow {
  return {
    isCorrect: row.isCorrect,
    timeSpentSeconds: row.timeSpentSeconds,
    topic: row.question.topic,
    userId,
  };
}
