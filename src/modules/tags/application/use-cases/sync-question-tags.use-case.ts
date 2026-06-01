import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface SyncQuestionTagsInput {
  questionId: string;
  tagNames: string[];
}

export class SyncQuestionTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: SyncQuestionTagsInput): Promise<TagEntity[]> {
    this.logger.log(
      SyncQuestionTagsUseCase.name,
      `Syncing tags for question ${input.questionId}`,
    );

    const question = await this.questionsRepository.findById(input.questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    await this.tagsRepository.syncQuestionTags(input.questionId, input.tagNames);
    return this.tagsRepository.findAllByQuestionId(input.questionId);
  }
}
