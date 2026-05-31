import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { FlashcardsRepository } from '../../domain/repositories/flashcards.repository';

export class ListFlashcardsByGroupUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly flashcardsRepository: FlashcardsRepository,
    private readonly groupsRepository: GroupsRepository,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(groupId: string): Promise<FlashcardEntity[]> {
    this.logger.log(
      ListFlashcardsByGroupUseCase.name,
      `Listing flashcards for group ${groupId}`,
    );

    const group = await this.groupsRepository.findById(groupId);
    if (!group) {
      this.exceptionsService.notFoundException({ message: 'Group not found' });
    }

    return this.flashcardsRepository.findManyByGroup(groupId);
  }
}
