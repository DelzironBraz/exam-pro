import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { QuestionsRepository } from '../../../questions/domain/repositories/questions.repository';
import { TagsRepository } from '../../domain/repositories/tags.repository';

export interface AttachTagToQuestionInput {
  tagId: string;
  questionId: string;
}

export class AttachTagToQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly tagsRepository: TagsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: AttachTagToQuestionInput): Promise<void> {
    this.logger.log(
      AttachTagToQuestionUseCase.name,
      `Attaching tag ${input.tagId} to question ${input.questionId}`,
    );

    const [tag, question] = await Promise.all([
      this.tagsRepository.findById(input.tagId),
      this.questionsRepository.findById(input.questionId),
    ]);

    if (!tag) {
      this.exceptionsService.notFoundException({ message: 'Tag not found' });
    }

    if (!question) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    await this.tagsRepository.attachToQuestion(input.tagId, input.questionId);
  }
}
