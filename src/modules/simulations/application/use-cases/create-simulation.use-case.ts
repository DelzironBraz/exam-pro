import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { TimerMode } from '../../domain/enums/timer-mode.enum';
import { SimulationsRepository } from '../../domain/repositories/simulations.repository';

export interface CreateSimulationInput {
  title: string;
  description?: string;
  groupId: string;
  timerMode: TimerMode;
  durationMinutes?: number;
  questionIds: string[];
  createdBy: string;
}

export class CreateSimulationUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly simulationsRepository: SimulationsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateSimulationInput): Promise<SimulationEntity> {
    this.logger.log(CreateSimulationUseCase.name, `Creating simulation: ${input.title}`);

    if (input.questionIds.length === 0) {
      this.exceptionsService.badRequestException({
        message: 'At least one question is required',
      });
    }

    if (input.timerMode === TimerMode.FIXED) {
      if (!input.durationMinutes || input.durationMinutes <= 0) {
        this.exceptionsService.badRequestException({
          message: 'durationMinutes is required for fixed timer mode',
        });
      }
    }

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    for (const questionId of input.questionIds) {
      const question = await this.questionsRepository.findById(questionId);
      if (!question) {
        this.exceptionsService.notFoundException({
          message: `Question not found: ${questionId}`,
        });
      }
      if (question.groupId !== input.groupId) {
        this.exceptionsService.badRequestException({
          message: `Question ${questionId} does not belong to the simulation group`,
        });
      }
    }

    const now = new Date();
    const simulation = new SimulationEntity(
      randomUUID(),
      input.title,
      input.description ?? null,
      input.groupId,
      input.timerMode,
      input.timerMode === TimerMode.FIXED ? (input.durationMinutes ?? null) : null,
      input.createdBy,
      now,
    );

    const created = await this.simulationsRepository.create(simulation);
    await this.simulationsRepository.setQuestions(created.id, input.questionIds);

    return created;
  }
}
