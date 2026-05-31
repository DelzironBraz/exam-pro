import { TimerMode } from '../enums/timer-mode.enum';

export class SimulationEntity {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string | null,
    readonly groupId: string,
    readonly timerMode: TimerMode,
    readonly durationMinutes: number | null,
    readonly createdBy: string,
    readonly createdAt: Date,
  ) {}
}
