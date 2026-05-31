import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { FLASHCARD_REVIEWS_REPOSITORY } from './domain/repositories/flashcard-reviews.repository';
import { FLASHCARDS_REPOSITORY } from './domain/repositories/flashcards.repository';
import { flashcardsUseCasesProviders } from './application/services/flashcards-use-cases.provider';
import { PrismaFlashcardReviewsRepository } from './infra/repositories/prisma-flashcard-reviews.repository';
import { PrismaFlashcardsRepository } from './infra/repositories/prisma-flashcards.repository';
import { FlashcardsController } from './presentation/controllers/flashcards.controller';

@Module({
  imports: [forwardRef(() => GroupsModule)],
  controllers: [FlashcardsController],
  providers: [
    PrismaFlashcardsRepository,
    {
      provide: FLASHCARDS_REPOSITORY,
      useExisting: PrismaFlashcardsRepository,
    },
    PrismaFlashcardReviewsRepository,
    {
      provide: FLASHCARD_REVIEWS_REPOSITORY,
      useExisting: PrismaFlashcardReviewsRepository,
    },
    ...flashcardsUseCasesProviders,
  ],
  exports: [FLASHCARDS_REPOSITORY, FLASHCARD_REVIEWS_REPOSITORY],
})
export class FlashcardsModule {}
