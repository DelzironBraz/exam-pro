import { SimulationAttemptAnswerEntity } from '../../domain/entities/simulation-attempt-answer.entity';
import { SimulationAttemptEntity } from '../../domain/entities/simulation-attempt.entity';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { TimerMode } from '../../domain/enums/timer-mode.enum';

export class SimulationResponse {
  id: string;
  title: string;
  description: string | null;
  groupId: string;
  timerMode: TimerMode;
  durationMinutes: number | null;
  createdBy: string;
  createdAt: Date;
  questionIds?: string[];
  totalQuestions?: number;

  constructor(simulation: SimulationEntity, questionIds?: string[]) {
    this.id = simulation.id;
    this.title = simulation.title;
    this.description = simulation.description;
    this.groupId = simulation.groupId;
    this.timerMode = simulation.timerMode;
    this.durationMinutes = simulation.durationMinutes;
    this.createdBy = simulation.createdBy;
    this.createdAt = simulation.createdAt;
    this.questionIds = questionIds;
  }

  static from(simulation: SimulationEntity, questionIds?: string[]): SimulationResponse {
    const response = new SimulationResponse(simulation, questionIds);
    if (questionIds) {
      response.totalQuestions = questionIds.length;
    }
    return response;
  }

  static fromListItem(item: { simulation: SimulationEntity; totalQuestions: number }): SimulationResponse {
    const response = new SimulationResponse(item.simulation);
    response.totalQuestions = item.totalQuestions;
    return response;
  }

  static fromList(simulations: SimulationEntity[]): SimulationResponse[] {
    return simulations.map((s) => SimulationResponse.from(s));
  }
}

export class SimulationAttemptAnswerResponse {
  questionId: string;
  selectedAlternativeId: string;
  timeSpentSeconds: number;
  isCorrect: boolean;
  answeredAt: Date;

  constructor(answer: SimulationAttemptAnswerEntity) {
    this.questionId = answer.questionId;
    this.selectedAlternativeId = answer.selectedAlternativeId;
    this.timeSpentSeconds = answer.timeSpentSeconds;
    this.isCorrect = answer.isCorrect;
    this.answeredAt = answer.answeredAt;
  }
}

export class SimulationAttemptResponse {
  id: string;
  simulationId: string;
  userId: string;
  startedAt: Date;
  finishedAt: Date | null;
  totalCorrect: number;
  totalWrong: number;
  totalTimeSeconds: number;
  totalQuestions?: number;
  answers?: SimulationAttemptAnswerResponse[];

  constructor(
    attempt: SimulationAttemptEntity,
    options?: {
      totalQuestions?: number;
      answers?: SimulationAttemptAnswerEntity[];
    },
  ) {
    this.id = attempt.id;
    this.simulationId = attempt.simulationId;
    this.userId = attempt.userId;
    this.startedAt = attempt.startedAt;
    this.finishedAt = attempt.finishedAt;
    this.totalCorrect = attempt.totalCorrect;
    this.totalWrong = attempt.totalWrong;
    this.totalTimeSeconds = attempt.totalTimeSeconds;
    this.totalQuestions = options?.totalQuestions;

    if (options?.answers) {
      this.answers = options.answers.map((a) => new SimulationAttemptAnswerResponse(a));
    }
  }
}

export class SimulationResultResponse extends SimulationAttemptResponse {
  scorePercent: number;

  constructor(
    attempt: SimulationAttemptEntity,
    totalQuestions: number,
    answers: SimulationAttemptAnswerEntity[],
  ) {
    super(attempt, { totalQuestions, answers });
    const total = totalQuestions > 0 ? totalQuestions : attempt.totalCorrect + attempt.totalWrong;
    this.scorePercent = total > 0 ? Math.round((attempt.totalCorrect / total) * 100) : 0;
  }
}
