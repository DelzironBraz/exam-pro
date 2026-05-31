import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { AlternativesRepository } from '../../domain/repositories/alternatives.repository';
import { QuestionsRepository } from '../../domain/repositories/questions.repository';

export class DeleteQuestionUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly questionsRepository: QuestionsRepository,
    private readonly alternativesRepository: AlternativesRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteQuestionUseCase.name, `Deleting question: ${id}`);

    const existing = await this.questionsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Question not found' });
    }

    await this.alternativesRepository.deleteByQuestionId(id);
    await this.questionsRepository.delete(id);
  }
}
