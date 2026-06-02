import { Provider } from '@nestjs/common';
import {
  EXCEPTIONS_SERVICE,
  ExceptionsService,
} from '../../../../shared/domain/exceptions/exceptions.interface';
import {
  LOGGER,
  Logger,
} from '../../../../shared/domain/logger/logger.interface';
import { GROUPS_REPOSITORY, GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import {
  TAGS_REPOSITORY,
  TagsRepository,
} from '../../../tags/domain/repositories/tags.repository';
import {
  ALTERNATIVES_REPOSITORY,
  AlternativesRepository,
} from '../../domain/repositories/alternatives.repository';
import {
  QUESTION_ANSWERS_REPOSITORY,
  QuestionAnswersRepository,
} from '../../domain/repositories/question-answers.repository';
import {
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../domain/repositories/questions.repository';
import { AnswerQuestionUseCase } from '../use-cases/answer-question.use-case';
import { CreateQuestionUseCase } from '../use-cases/create-question.use-case';
import { DeleteQuestionUseCase } from '../use-cases/delete-question.use-case';
import { GetQuestionUseCase } from '../use-cases/get-question.use-case';
import { ListQuestionsUseCase } from '../use-cases/list-questions.use-case';
import { UpdateQuestionUseCase } from '../use-cases/update-question.use-case';

export const questionsUseCasesProviders: Provider[] = [
  {
    provide: CreateQuestionUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      groupsRepository: GroupsRepository,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateQuestionUseCase(
        logger,
        questionsRepository,
        alternativesRepository,
        groupsRepository,
        tagsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      GROUPS_REPOSITORY,
      TAGS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetQuestionUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      tagsRepository: TagsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetQuestionUseCase(
        logger,
        questionsRepository,
        alternativesRepository,
        tagsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      TAGS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ListQuestionsUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      questionAnswersRepository: QuestionAnswersRepository,
      tagsRepository: TagsRepository,
    ) =>
      new ListQuestionsUseCase(
        logger,
        questionsRepository,
        alternativesRepository,
        questionAnswersRepository,
        tagsRepository,
      ),
    inject: [
      LOGGER,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      QUESTION_ANSWERS_REPOSITORY,
      TAGS_REPOSITORY,
    ],
  },
  {
    provide: UpdateQuestionUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateQuestionUseCase(logger, questionsRepository, exceptionsService),
    inject: [LOGGER, QUESTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteQuestionUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new DeleteQuestionUseCase(
        logger,
        questionsRepository,
        alternativesRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: AnswerQuestionUseCase,
    useFactory: (
      logger: Logger,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      questionAnswersRepository: QuestionAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new AnswerQuestionUseCase(
        logger,
        questionsRepository,
        alternativesRepository,
        questionAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      QUESTION_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
];
