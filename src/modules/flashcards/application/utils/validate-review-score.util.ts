const MIN_SCORE = 1;
const MAX_SCORE = 5;

export function isValidReviewScore(score: number): boolean {
  return Number.isInteger(score) && score >= MIN_SCORE && score <= MAX_SCORE;
}

export function reviewScoreRangeMessage(): string {
  return `Score must be an integer between ${MIN_SCORE} and ${MAX_SCORE}`;
}
