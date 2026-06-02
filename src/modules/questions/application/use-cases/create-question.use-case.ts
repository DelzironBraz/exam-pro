import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { AlternativeEntity } from '../../domain/entities/alternative.entity';
import { QuestionEntity } from '../../domain/entities/question.entity';
import { DifficultyLevel } from '../../domain/enums/difficulty-level.enum';
import { QuestionType } from '../../domain/enums/question-type.enum';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { TagsRepository } from '../../../tags/domain/repositories/tags.repository';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';
import {
  AlternativeInput,
  validateQuestionInput,
} from '../utils/validate-alternatives.util';

export interface CreateQuestionInput {
  statement: string;
  groupId: string;
  discipline?: string;
  topic?: string;
  difficulty: DifficultyLevel;
  type?: QuestionType;
  referenceAnswer?: string;
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

    const type = input.type ?? QuestionType.MULTIPLE_CHOICE;
    const validationError = validateQuestionInput({
      type,
      alternatives: input.alternatives,
      referenceAnswer: input.referenceAnswer,
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
      type,
      type === QuestionType.DISCURSIVE ? input.referenceAnswer!.trim() : null,
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
