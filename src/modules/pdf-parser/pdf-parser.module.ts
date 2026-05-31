import { Module, forwardRef } from '@nestjs/common';
import { ExamsModule } from '../exams/exams.module';
import { GroupsModule } from '../groups/groups.module';
import { QuestionsModule } from '../questions/questions.module';
import { StudyPlansModule } from '../study-plans/study-plans.module';
import { pdfParserUseCasesProviders } from './application/services/pdf-parser-use-cases.provider';
import { OCR_PROVIDER } from './domain/providers/ocr.provider';
import { PDF_PARSER } from './domain/providers/pdf-parser.provider';
import { IMPORT_JOBS_REPOSITORY } from './domain/repositories/import-jobs.repository';
import { HeuristicPdfParser } from './infra/parser/heuristic-pdf.parser';
import { PdfParseOCRProvider } from './infra/ocr/pdf-parse-ocr.provider';
import { PrismaImportJobsRepository } from './infra/repositories/prisma-import-jobs.repository';
import { LocalPdfStorageService } from './infra/storage/local-pdf-storage.service';
import { PdfParserController } from './presentation/controllers/pdf-parser.controller';

@Module({
  imports: [
    GroupsModule,
    forwardRef(() => QuestionsModule),
    forwardRef(() => ExamsModule),
    forwardRef(() => StudyPlansModule),
  ],
  controllers: [PdfParserController],
  providers: [
    LocalPdfStorageService,
    PrismaImportJobsRepository,
    {
      provide: IMPORT_JOBS_REPOSITORY,
      useExisting: PrismaImportJobsRepository,
    },
    PdfParseOCRProvider,
    { provide: OCR_PROVIDER, useExisting: PdfParseOCRProvider },
    HeuristicPdfParser,
    { provide: PDF_PARSER, useExisting: HeuristicPdfParser },
    ...pdfParserUseCasesProviders,
  ],
  exports: [IMPORT_JOBS_REPOSITORY],
})
export class PdfParserModule {}
