import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export interface UpdateFlashcardInput {
  flashcardId: string;
  frontContent?: string;
  backContent?: string;
  difficulty?: number;
}

export class UpdateFlashcardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: UpdateFlashcardInput): Promise<FlashcardEntity> {
    this.logger.log(UpdateFlashcardUseCase.name, `Updating flashcard: ${input.flashcardId}`);

    const existing = await this.flashcardsRepository.findById(input.flashcardId);
    if (!existing) {
      this.exceptionsService.notFoundException({ message: 'Flashcard not found' });
    }

    const difficulty = input.difficulty ?? existing.difficulty;
    if (difficulty < 1 || difficulty > 5) {
      this.exceptionsService.badRequestException({
        message: 'Difficulty must be between 1 and 5',
      });
    }

    const updated = new FlashcardEntity(
      existing.id,
      existing.groupId,
      input.frontContent ?? existing.frontContent,
      input.backContent ?? existing.backContent,
      difficulty,
      existing.createdBy,
      existing.createdAt,
    );

    return this.flashcardsRepository.update(updated);
  }
}
