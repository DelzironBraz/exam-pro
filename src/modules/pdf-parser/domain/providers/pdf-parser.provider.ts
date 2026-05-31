import { ParsedQuestionEntity } from '../entities/parsed-question.entity';
import { ParsedStudyPlanEntity } from '../entities/parsed-study-plan.entity';

export abstract class PDFParser {
  abstract parseExam(content: string): Promise<ParsedQuestionEntity[]>;

  abstract parseStudyPlan(content: string): Promise<ParsedStudyPlanEntity>;
}

export const PDF_PARSER = Symbol('PDF_PARSER');
