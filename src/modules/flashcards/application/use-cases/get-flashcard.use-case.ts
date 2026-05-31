import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export class GetFlashcardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(id: string): Promise<FlashcardEntity> {
    this.logger.log(GetFlashcardUseCase.name, `Getting flashcard: ${id}`);

    const flashcard = await this.flashcardsRepository.findById(id);
    if (!flashcard) {
      this.exceptionsService.notFoundException({ message: 'Flashcard not found' });
    }

    return flashcard;
  }
}
