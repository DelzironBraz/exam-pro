import { ExceptionsService } from '../../../../shared/domain/exceptions/exceptions.interface';
import { Logger } from '../../../../shared/domain/logger/logger.interface';
import { ImportJobEntity } from '../../domain/entities/import-job.entity';
import { ImportStatus } from '../../domain/enums/import-status.enum';
import { ImportType } from '../../domain/enums/import-type.enum';
import { OCRProvider } from '../../domain/providers/ocr.provider';
import { PDFParser } from '../../domain/providers/pdf-parser.provider';
import { ImportJobsRepository } from '../../domain/repositories/import-jobs.repository';
import {
  ExamParsePayload,
  serializeParsedQuestions,
} from '../utils/parsed-payload.serializer';
import { validateParsedQuestions } from '../utils/validate-parsed-questions.util';

export interface ProcessExamPdfInput {
  jobId: string;
}

export interface ProcessExamPdfOutput {
  job: ImportJobEntity;
  validation: ReturnType<typeof validateParsedQuestions>;
}

export class ProcessExamPdfUseCase {
  constructor(
    private readonly logger: Logger,
    private readonly importJobsRepository: ImportJobsRepository,
    private readonly ocrProvider: OCRProvider,
    private readonly pdfParser: PDFParser,
    private readonly exceptionsService: ExceptionsService,
  ) {}

  async execute(input: ProcessExamPdfInput): Promise<ProcessExamPdfOutput> {
    this.logger.log(ProcessExamPdfUseCase.name, `Processing exam PDF job ${input.jobId}`);

    const job = await this.importJobsRepository.findById(input.jobId);
    if (!job) {
      this.exceptionsService.notFoundException({ message: 'Import job not found' });
    }

    if (job.type !== ImportType.EXAM) {
      this.exceptionsService.badRequestException({ message: 'Job is not an exam import' });
    }

    if (job.status === ImportStatus.COMPLETED) {
      this.exceptionsService.badRequestException({ message: 'Job already processed' });
    }

    await this.importJobsRepository.updateStatus(input.jobId, ImportStatus.PROCESSING);

    try {
      const rawText = await this.ocrProvider.extractText(job.fileUrl);
      const questions = await this.pdfParser.parseExam(rawText);
      const validation = validateParsedQuestions(questions);

      const payload: ExamParsePayload = {
        kind: 'exam',
        questions: serializeParsedQuestions(questions),
        validation,
      };

      await this.importJobsRepository.saveParseResult(input.jobId, {
        rawText,
        parsedPayload: payload,
      });

      const updated = await this.importJobsRepository.findById(input.jobId);
      return { job: updated!, validation };
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
