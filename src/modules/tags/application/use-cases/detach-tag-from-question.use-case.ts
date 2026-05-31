import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface DetachTagFromQuestionInput {
  tagId: string;
  questionId: string;
}

export class DetachTagFromQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: DetachTagFromQuestionInput): Promise<void> {
    this.logger.log(
      DetachTagFromQuestionUseCase.name,
      `Detaching tag ${input.tagId} from question ${input.questionId}`,
    );

    const tag = await this.tagsRepository.findById(input.tagId);
    if (!tag) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    await this.tagsRepository.detachFromQuestion(input.tagId, input.questionId);
  }
}
