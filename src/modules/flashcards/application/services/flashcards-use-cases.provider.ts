import { Provider } from '@nestjs/common';
import {
  EXCEPTIONS_SERVICE,
  ExceptionsService,
} from '../../../../shared/domain/exceptions/exceptions.interface';
import {
  LOGGER,
  Logger,
} from '../../../../shared/domain/logger/logger.interface';
import {
  GROUPS_REPOSITORY,
  GroupsRepository,
} from '../../../groups/domain/repositories/groups.repository';
import {
  FLASHCARD_REVIEWS_REPOSITORY,
  FlashcardReviewsRepository,
} from '../../domain/repositories/flashcard-reviews.repository';
import {
  FLASHCARDS_REPOSITORY,
  FlashcardsRepository,
} from '../../domain/repositories/flashcards.repository';
import { CreateFlashcardUseCase } from '../use-cases/create-flashcard.use-case';
import { DeleteFlashcardUseCase } from '../use-cases/delete-flashcard.use-case';
import { GetFlashcardUseCase } from '../use-cases/get-flashcard.use-case';
import { GetPendingFlashcardsUseCase } from '../use-cases/get-pending-flashcards.use-case';
import { ListFlashcardsByGroupUseCase } from '../use-cases/list-flashcards-by-group.use-case';
import { ReviewFlashcardUseCase } from '../use-cases/review-flashcard.use-case';
import { UpdateFlashcardUseCase } from '../use-cases/update-flashcard.use-case';

export const flashcardsUseCasesProviders: Provider[] = [
  {
    provide: CreateFlashcardUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateFlashcardUseCase(
        logger,
        flashcardsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, FLASHCARDS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetFlashcardUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      exceptionsService: ExceptionsService,
    ) => new GetFlashcardUseCase(logger, flashcardsRepository, exceptionsService),
    inject: [LOGGER, FLASHCARDS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListFlashcardsByGroupUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListFlashcardsByGroupUseCase(
        logger,
        flashcardsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, FLASHCARDS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: UpdateFlashcardUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateFlashcardUseCase(logger, flashcardsRepository, exceptionsService),
    inject: [LOGGER, FLASHCARDS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteFlashcardUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteFlashcardUseCase(logger, flashcardsRepository, exceptionsService),
    inject: [LOGGER, FLASHCARDS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ReviewFlashcardUseCase,
    useFactory: (
      logger: Logger,
      flashcardsRepository: FlashcardsRepository,
      flashcardReviewsRepository: FlashcardReviewsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ReviewFlashcardUseCase(
        logger,
        flashcardsRepository,
        flashcardReviewsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      FLASHCARDS_REPOSITORY,
      FLASHCARD_REVIEWS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetPendingFlashcardsUseCase,
    useFactory: (
      logger: Logger,
      flashcardReviewsRepository: FlashcardReviewsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetPendingFlashcardsUseCase(
        logger,
        flashcardReviewsRepository,
        groupsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, FLASHCARD_REVIEWS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
];
