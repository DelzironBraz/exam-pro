import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { OCRProvider } from '../../domain/providers/ocr.provider';
import { PDFParser } from '../../domain/providers/pdf-parser.provider';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';
import {
  serializeParsedStudyPlan,
  StudyPlanParsePayload,
} from '../utils/parsed-payload.serializer';

export interface ProcessStudyPlanPdfInput {
  jobId: string;
}

export class ProcessStudyPlanPdfUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
    private readonly ocrProvider: OCRProvider,
    private readonly pdfParser: PDFParser,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ProcessStudyPlanPdfInput): Promise<ImportJobEntity> {
    this.logger.log(ProcessStudyPlanPdfUseCase.name, `Processing study plan PDF ${input.jobId}`);

    const job = await this.importJobsRepository.findById(input.jobId);
    if (!job) {
      this.exceptionsService.notFoundException({ message: 'Import job not found' });
    }

    if (job.type !== ImportType.STUDY_PLAN) {
      this.exceptionsService.badRequestException({ message: 'Job is not a study plan import' });
    }

    await this.importJobsRepository.updateStatus(input.jobId, ImportStatus.PROCESSING);

    try {
      const rawText = await this.ocrProvider.extractText(job.fileUrl);
      const plan = await this.pdfParser.parseStudyPlan(rawText);

      const payload: StudyPlanParsePayload = {
        kind: 'study_plan',
        plan: serializeParsedStudyPlan(plan),
      };

      await this.importJobsRepository.saveParseResult(input.jobId, {
        rawText,
        parsedPayload: payload,
      });

      const updated = await this.importJobsRepository.findById(input.jobId);
      return updated!;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'PDF processing failed';
      await this.importJobsRepository.updateStatus(
        input.jobId,
        ImportStatus.FAILED,
        message,
      );
      this.exceptionsService.badRequestException({ message });
    }
  }
}
