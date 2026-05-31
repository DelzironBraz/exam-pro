import { Module, forwardRef } from '@nestjs/common';
import { GroupsModule } from '../groups/groups.module';
import { TagsModule } from '../tags/tags.module';
import { ALTERNATIVES_REPOSITORY } from './domain/repositories/alternatives.repository';
import { QUESTION_ANSWERS_REPOSITORY } from './domain/repositories/question-answers.repository';
import { QUESTIONS_REPOSITORY } from './domain/repositories/questions.repository';
import { questionsUseCasesProviders } from './application/services/questions-use-cases.provider';
import { PrismaAlternativesRepository } from './infra/repositories/prisma-alternatives.repository';
import { PrismaQuestionAnswersRepository } from './infra/repositories/prisma-question-answers.repository';
import { PrismaQuestionsRepository } from './infra/repositories/prisma-questions.repository';
import { QuestionsController } from './presentation/controllers/questions.controller';

@Module({
  imports: [forwardRef(() => GroupsModule), forwardRef(() => TagsModule)],
  controllers: [QuestionsController],
  providers: [
    PrismaQuestionsRepository,
    {
      provide: QUESTIONS_REPOSITORY,
      useExisting: PrismaQuestionsRepository,
    },
    PrismaAlternativesRepository,
    {
      provide: ALTERNATIVES_REPOSITORY,
      useExisting: PrismaAlternativesRepository,
    },
    PrismaQuestionAnswersRepository,
    {
      provide: QUESTION_ANSWERS_REPOSITORY,
      useExisting: PrismaQuestionAnswersRepository,
    },
    ...questionsUseCasesProviders,
  ],
  exports: [
    QUESTIONS_REPOSITORY,
    ALTERNATIVES_REPOSITORY,
    QUESTION_ANSWERS_REPOSITORY,
  ],
})
export class QuestionsModule {}
