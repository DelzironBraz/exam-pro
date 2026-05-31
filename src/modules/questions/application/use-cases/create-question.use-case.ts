import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';
import {
  AlternativeInput,
  isDissertativeDiscipline,
  validateAlternatives,
} from '../utils/validate-alternatives.util';

export interface CreateQuestionInput {
  statement: string;
  groupId: string;
  discipline?: string;
  topic?: string;
  difficulty: DifficultyLevel;
  explanation?: string;
  alternatives: AlternativeInput[];
  tags?: string[];
  createdBy: string;
}

export class CreateQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateQuestionInput): Promise<QuestionEntity> {
    this.logger.log(CreateQuestionUseCase.name, 'Creating question');

    const allowDissertative = isDissertativeDiscipline(input.discipline);
    const validationError = validateAlternatives(input.alternatives, {
      allowDissertative,
    });
    if (validationError) {
      this.exceptionsService.badRequestException({ message: validationError });
    }

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const questionId = randomUUID();
    const now = new Date();

    const question = new QuestionEntity(
      questionId,
      input.statement,
      input.groupId,
      input.discipline ?? null,
      input.topic ?? null,
      input.difficulty,
      input.explanation ?? null,
      input.createdBy,
      now,
    );

    const created = await this.questionsRepository.create(question);

    if (input.alternatives.length > 0) {
      const alternatives = input.alternatives.map(
        (alt) =>
          new AlternativeEntity(
            randomUUID(),
            questionId,
            alt.label,
            alt.content,
            alt.isCorrect,
          ),
      );

      await this.alternativesRepository.createMany(alternatives);
    }

    if (input.tags?.length) {
      await this.tagsRepository.syncQuestionTags(questionId, input.tags);
    }

    return created;
  }
}
