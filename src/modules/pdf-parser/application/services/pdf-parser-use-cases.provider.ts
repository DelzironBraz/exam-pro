import { Provider } from '@nestjs/common';
import {
  EXCEPTIONS_SERVICE,
  ExceptionsService,
} from '../../../../shared/domain/exceptions/exceptions.interface';
import {
  LOGGER,
  Logger,
} from '../../../../shared/domain/logger/logger.interface';
import { EXAMS_REPOSITORY, ExamsRepository } from '../../../exams/domain/repositories/exams.repository';
import { GROUPS_REPOSITORY, GroupsRepository } from '../../../groups/domain/repositories/groups.repository';
import {
  ALTERNATIVES_REPOSITORY,
  AlternativesRepository,
} from '../../../questions/domain/repositories/alternatives.repository';
import {
  QUESTIONS_REPOSITORY,
  QuestionsRepository,
} from '../../../questions/domain/repositories/questions.repository';
import {
  STUDY_PLAN_ITEMS_REPOSITORY,
  StudyPlanItemsRepository,
} from '../../../study-plans/domain/repositories/study-plan-items.repository';
import {
  STUDY_PLANS_REPOSITORY,
  StudyPlansRepository,
} from '../../../study-plans/domain/repositories/study-plans.repository';
import { OCR_PROVIDER, OCRProvider } from '../../domain/providers/ocr.provider';
import { PDF_PARSER, PDFParser } from '../../domain/providers/pdf-parser.provider';
import {
  IMPORT_JOBS_REPOSITORY,
  ImportJobsRepository,
} from '../../domain/repositories/import-jobs.repository';
import { ApproveParsedExamUseCase } from '../use-cases/approve-parsed-exam.use-case';
import { ApproveParsedStudyPlanUseCase } from '../use-cases/approve-parsed-study-plan.use-case';
import { GetImportJobPreviewUseCase } from '../use-cases/get-import-job-preview.use-case';
import { ListImportJobsUseCase } from '../use-cases/list-import-jobs.use-case';
import { ProcessExamPdfUseCase } from '../use-cases/process-exam-pdf.use-case';
import { ProcessStudyPlanPdfUseCase } from '../use-cases/process-study-plan-pdf.use-case';
import { UploadExamPdfUseCase } from '../use-cases/upload-exam-pdf.use-case';
import { UploadStudyPlanPdfUseCase } from '../use-cases/upload-study-plan-pdf.use-case';

export const pdfParserUseCasesProviders: Provider[] = [
  {
    provide: UploadExamPdfUseCase,
    useFactory: (logger: Logger, importJobsRepository: ImportJobsRepository) =>
      new UploadExamPdfUseCase(logger, importJobsRepository),
    inject: [LOGGER, IMPORT_JOBS_REPOSITORY],
  },
  {
    provide: UploadStudyPlanPdfUseCase,
    useFactory: (logger: Logger, importJobsRepository: ImportJobsRepository) =>
      new UploadStudyPlanPdfUseCase(logger, importJobsRepository),
    inject: [LOGGER, IMPORT_JOBS_REPOSITORY],
  },
  {
    provide: ProcessExamPdfUseCase,
    useFactory: (
      logger: Logger,
      importJobsRepository: ImportJobsRepository,
      ocrProvider: OCRProvider,
      pdfParser: PDFParser,
      exceptionsService: ExceptionsService,
    ) =>
      new ProcessExamPdfUseCase(
        logger,
        importJobsRepository,
        ocrProvider,
        pdfParser,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      IMPORT_JOBS_REPOSITORY,
      OCR_PROVIDER,
      PDF_PARSER,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ProcessStudyPlanPdfUseCase,
    useFactory: (
      logger: Logger,
      importJobsRepository: ImportJobsRepository,
      ocrProvider: OCRProvider,
      pdfParser: PDFParser,
      exceptionsService: ExceptionsService,
    ) =>
      new ProcessStudyPlanPdfUseCase(
        logger,
        importJobsRepository,
        ocrProvider,
        pdfParser,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      IMPORT_JOBS_REPOSITORY,
      OCR_PROVIDER,
      PDF_PARSER,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: GetImportJobPreviewUseCase,
    useFactory: (
      logger: Logger,
      importJobsRepository: ImportJobsRepository,
      exceptionsService: ExceptionsService,
    ) => new GetImportJobPreviewUseCase(logger, importJobsRepository, exceptionsService),
    inject: [LOGGER, IMPORT_JOBS_REPOSITORY, EXCEPTIONS_SERVICE],
  },
  {
    provide: ListImportJobsUseCase,
    useFactory: (logger: Logger, importJobsRepository: ImportJobsRepository) =>
      new ListImportJobsUseCase(logger, importJobsRepository),
    inject: [LOGGER, IMPORT_JOBS_REPOSITORY],
  },
  {
    provide: ApproveParsedExamUseCase,
    useFactory: (
      logger: Logger,
      importJobsRepository: ImportJobsRepository,
      questionsRepository: QuestionsRepository,
      alternativesRepository: AlternativesRepository,
      groupsRepository: GroupsRepository,
      examsRepository: ExamsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ApproveParsedExamUseCase(
        logger,
        importJobsRepository,
        questionsRepository,
        alternativesRepository,
        groupsRepository,
        examsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      IMPORT_JOBS_REPOSITORY,
      QUESTIONS_REPOSITORY,
      ALTERNATIVES_REPOSITORY,
      GROUPS_REPOSITORY,
      EXAMS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
  {
    provide: ApproveParsedStudyPlanUseCase,
    useFactory: (
      logger: Logger,
      importJobsRepository: ImportJobsRepository,
      groupsRepository: GroupsRepository,
      studyPlansRepository: StudyPlansRepository,
      studyPlanItemsRepository: StudyPlanItemsRepository,
      exceptionsService: ExceptionsService,
    ) =>
      new ApproveParsedStudyPlanUseCase(
        logger,
        importJobsRepository,
        groupsRepository,
        studyPlansRepository,
        studyPlanItemsRepository,
        exceptionsService,
      ),
    inject: [
      LOGGER,
      IMPORT_JOBS_REPOSITORY,
      GROUPS_REPOSITORY,
      STUDY_PLANS_REPOSITORY,
      STUDY_PLAN_ITEMS_REPOSITORY,
      EXCEPTIONS_SERVICE,
    ],
  },
];
