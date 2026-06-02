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
  ALTERNATIVES_REPOSITORY,
  AlternativesRepository,
} from '../../../questions/domain/repositories/alternatives.repository';
import {
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../../questions/domain/repositories/questions.repository';
import {
  EXAM_ATTEMPT_ANSWERS_REPOSITORY,
  ExamAttemptAnswersRepository,
} from '../../domain/repositories/exam-attempt-answers.repository';
import {
  EXAM_ATTEMPTS_REPOSITORY,
  ExamAttemptsRepository,
} from '../../domain/repositories/exam-attempts.repository';
import {
  EXAM_SECTIONS_REPOSITORY,
  ExamSectionsRepository,
} from '../../domain/repositories/exam-sections.repository';
import {
  EXAMS_REPOSITORY,
  ExamsRepository,
} from '../../domain/repositories/exams.repository';
import { AddExamSectionUseCase } from '../use-cases/add-exam-section.use-case';
import { CreateExamUseCase } from '../use-cases/create-exam.use-case';
import { DeleteExamSectionUseCase } from '../use-cases/delete-exam-section.use-case';
import { DeleteExamUseCase } from '../use-cases/delete-exam.use-case';
import { FinishExamUseCase } from '../use-cases/finish-exam.use-case';
import { GetExamAttemptUseCase } from '../use-cases/get-exam-attempt.use-case';
import { GetExamUseCase } from '../use-cases/get-exam.use-case';
import { ListExamQuestionsUseCase } from '../use-cases/list-exam-questions.use-case';
import { ListExamsByGroupUseCase } from '../use-cases/list-exams-by-group.use-case';
import { ListUserExamAttemptsUseCase } from '../use-cases/list-user-exam-attempts.use-case';
import { StartExamUseCase } from '../use-cases/start-exam.use-case';
import { SubmitExamAnswerUseCase } from '../use-cases/submit-exam-answer.use-case';
import { UpdateExamUseCase } from '../use-cases/update-exam.use-case';

export const examsUseCasesProviders: Provider[] = [
  {
    provide: CreateExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      groupsRepository: GroupsRepository,
      questionsRepository: QuestionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new CreateExamUseCase(
        logger,
        examsRepository,
        groupsRepository,
        questionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, EXAMS_REPOSITORY, GROUPS_REPOSITORY, QUESTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: GetExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examSectionsRepository: ExamSectionsRepository,
      exceptionsService: ExceptionsService,
    ) => new GetExamUseCase(logger, examsRepository, examSectionsRepository, exceptionsService),
    inject: [LOGGER, EXAMS_REPOSITORY, EXAM_SECTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListExamsByGroupUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      groupsRepository: GroupsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListExamsByGroupUseCase(logger, examsRepository, groupsRepository, exceptionsService),
    inject: [LOGGER, EXAMS_REPOSITORY, GROUPS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: UpdateExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      exceptionsService: ExceptionsService,
    ) => new UpdateExamUseCase(logger, examsRepository, exceptionsService),
    inject: [LOGGER, EXAMS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      exceptionsService: ExceptionsService,
    ) => new DeleteExamUseCase(logger, examsRepository, exceptionsService),
    inject: [LOGGER, EXAMS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: AddExamSectionUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examSectionsRepository: ExamSectionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new AddExamSectionUseCase(
        logger,
        examsRepository,
        examSectionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, EXAMS_REPOSITORY, EXAM_SECTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: DeleteExamSectionUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examSectionsRepository: ExamSectionsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new DeleteExamSectionUseCase(
        logger,
        examsRepository,
        examSectionsRepository,
        exceptionsService,
      ),
    inject: [LOGGER, EXAMS_REPOSITORY, EXAM_SECTIONS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: StartExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examAttemptsRepository: ExamAttemptsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new StartExamUseCase(logger, examsRepository, examAttemptsRepository, exceptionsService),
    inject: [LOGGER, EXAMS_REPOSITORY, EXAM_ATTEMPTS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: SubmitExamAnswerUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examAttemptsRepository: ExamAttemptsRepository,
      examAttemptAnswersRepository: ExamAttemptAnswersRepository,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new SubmitExamAnswerUseCase(
        logger,
        examsRepository,
        examAttemptsRepository,
        examAttemptAnswersRepository,
        questionsRepository,
        alternativesRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      EXAMS_REPOSITORY,
      EXAM_ATTEMPTS_REPOSITORY,
      EXAM_ATTEMPT_ANSWERS_REPOSITORY,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: FinishExamUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      examAttemptsRepository: ExamAttemptsRepository,
      examAttemptAnswersRepository: ExamAttemptAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new FinishExamUseCase(
        logger,
        examsRepository,
        examAttemptsRepository,
        examAttemptAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      EXAMS_REPOSITORY,
      EXAM_ATTEMPTS_REPOSITORY,
      EXAM_ATTEMPT_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetExamAttemptUseCase,
    useFactory: (
      logger: Logger,
      examAttemptsRepository: ExamAttemptsRepository,
      examsRepository: ExamsRepository,
      examAttemptAnswersRepository: ExamAttemptAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new GetExamAttemptUseCase(
        logger,
        examAttemptsRepository,
        examsRepository,
        examAttemptAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      EXAM_ATTEMPTS_REPOSITORY,
      EXAMS_REPOSITORY,
      EXAM_ATTEMPT_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ListExamQuestionsUseCase,
    useFactory: (
      logger: Logger,
      examsRepository: ExamsRepository,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      examAttemptsRepository: ExamAttemptsRepository,
      examAttemptAnswersRepository: ExamAttemptAnswersRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ListExamQuestionsUseCase(
        logger,
        examsRepository,
        questionsRepository,
        alternativesRepository,
        examAttemptsRepository,
        examAttemptAnswersRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      EXAMS_REPOSITORY,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      EXAM_ATTEMPTS_REPOSITORY,
      EXAM_ATTEMPT_ANSWERS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ListUserExamAttemptsUseCase,
    useFactory: (logger: Logger, examAttemptsRepository: ExamAttemptsRepository) =>
      new ListUserExamAttemptsUseCase(logger, examAttemptsRepository),
    inject: [LOGGER, EXAM_ATTEMPTS_REPOSITORY],
  },
];
