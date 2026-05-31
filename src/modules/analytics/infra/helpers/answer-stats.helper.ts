export interface AnswerStatRow {
  isCorrect: boolean;
  timeSpentSeconds: number;
  topic: string | null;
  userId?: string;
}

export interface AggregatedStats {
  total: number;
  correct: number;
  wrong: number;
  averageTimeSeconds: number;
}

export function aggregateStats(rows: AnswerStatRow[]): AggregatedStats {
  const total = rows.length;
  if (total === 0) {
    return { total: 0, correct: 0, wrong: 0, averageTimeSeconds: 0 };
  }

  const correct = rows.filter((r) => r.isCorrect).length;
  const wrong = total - correct;
  const averageTimeSeconds =
    rows.reduce((sum, r) => sum + r.timeSpentSeconds, 0) / total;

  return { total, correct, wrong, averageTimeSeconds };
}

export function accuracy(correct: number, total: number): number {
  if (total === 0) {
    return 0;
  }
  return Math.round((correct / total) * 10000) / 10000;
}

export interface TopicAccumulator {
  total: number;
  correct: number;
}

export function groupByTopic(
  rows: AnswerStatRow[],
): Map<string, TopicAccumulator> {
  const map = new Map<string, TopicAccumulator>();

  for (const row of rows) {
    if (!row.topic?.trim()) {
      continue;
    }

    const topic = row.topic.trim();
    const current = map.get(topic) ?? { total: 0, correct: 0 };
    current.total += 1;
    if (row.isCorrect) {
      current.correct += 1;
    }
    map.set(topic, current);
  }

  return map;
}

export function groupByUser(
  rows: AnswerStatRow[],
): Map<string, TopicAccumulator> {
  const map = new Map<string, TopicAccumulator>();

  for (const row of rows) {
    if (!row.userId) {
      continue;
    }

    const current = map.get(row.userId) ?? { total: 0, correct: 0 };
    current.total += 1;
    if (row.isCorrect) {
      current.correct += 1;
    }
    map.set(row.userId, current);
  }

  return map;
}

export const MIN_TOPIC_SAMPLE = 3;
export const WEAK_TOPIC_ACCURACY_THRESHOLD = 0.55;
export const STRONG_TOPIC_ACCURACY_THRESHOLD = 0.75;
