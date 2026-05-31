import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { TagEntity } from '../../domain/entities/tag.entity';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export class ListQuestionTagsUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(questionId: string): Promise<TagEntity[]> {
    this.logger.log(ListQuestionTagsUseCase.name, `Listing tags for question ${questionId}`);

    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    return this.tagsRepository.findByQuestionId(questionId);
  }
}
