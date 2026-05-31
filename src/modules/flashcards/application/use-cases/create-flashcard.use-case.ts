import { randomUUID } from 'crypto';
import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export interface CreateFlashcardInput {
  groupId: string;
  frontContent: string;
  backContent: string;
  difficulty?: number;
  createdBy: string;
}

export class CreateFlashcardUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: CreateFlashcardInput): Promise<FlashcardEntity> {
    this.logger.log(CreateFlashcardUseCase.name, 'Creating flashcard');

    const group = await this.groupsRepository.findById(input.groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    const difficulty = input.difficulty ?? 1;
    if (difficulty < 1 || difficulty > 5) {
      this.exceptionsService.badRequestException({
        message: 'Difficulty must be between 1 and 5',
      });
    }

    const flashcard = new FlashcardEntity(
      randomUUID(),
      input.groupId,
      input.frontContent,
      input.backContent,
      difficulty,
      input.createdBy,
      new Date(),
    );

    return this.flashcardsRepository.create(flashcard);
  }
}
