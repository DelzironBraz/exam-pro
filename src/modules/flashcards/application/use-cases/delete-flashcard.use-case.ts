import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export class DeleteFlashcardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<void> {
    this.logger.log(DeleteFlashcardUseCase.name, `Deleting flashcard: ${id}`);

    const existing = await this.flashcardsRepository.findById(id);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Flashcard not found' });
    }

    await this.flashcardsRepository.delete(id);
  }
}
