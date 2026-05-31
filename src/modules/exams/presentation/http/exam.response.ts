import { GetExamOutput } from '../../application/use-cases/get-exam.use-case';
import { GetExamAttemptOutput } from '../../application/use-cases/get-exam-attempt.use-case';
import { ExamAttemptEntity } from '../../domain/entities/exam-attempt.entity';
import { ExamSectionEntity } from '../../domain/entities/exam-section.entity';
import { ExamEntity } from '../../domain/entities/exam.entity';

export class ExamSectionResponse {
  id: string;
  examId: string;
  name: string;
  weight: number;
  order: number;

  constructor(section: ExamSectionEntity) {
    this.id = section.id;
    this.examId = section.examId;
    this.name = section.name;
    this.weight = section.weight;
    this.order = section.order;
  }

  static fromList(sections: ExamSectionEntity[]): ExamSectionResponse[] {
    return sections.map((s) => new ExamSectionResponse(s));
  }
}

export class ExamResponse {
  id: string;
  groupId: string;
  title: string;
  institution: string;
  organization: string;
  year: number;
  roleName: string;
  durationMinutes: number;
  createdAt: Date;
  sections?: ExamSectionResponse[];
  questionIds?: string[];
  totalQuestions?: number;

  constructor(exam: ExamEntity, options?: Partial<GetExamOutput>) {
    this.id = exam.id;
    this.groupId = exam.groupId;
    this.title = exam.title;
    this.institution = exam.institution;
    this.organization = exam.organization;
    this.year = exam.year;
    this.roleName = exam.roleName;
    this.durationMinutes = exam.durationMinutes;
    this.createdAt = exam.createdAt;

    if (options?.sections) {
      this.sections = ExamSectionResponse.fromList(options.sections);
    }
    if (options?.questionIds) {
      this.questionIds = options.questionIds;
      this.totalQuestions = options.totalQuestions;
    }
  }

  static from(exam: ExamEntity): ExamResponse {
    return new ExamResponse(exam);
  }

  static fromDetail(output: GetExamOutput): ExamResponse {
    return new ExamResponse(output.exam, output);
  }

  static fromList(exams: ExamEntity[]): ExamResponse[] {
    return exams.map((e) => ExamResponse.from(e));
  }
}

export class ExamAttemptResponse {
  id: string;
  examId: string;
  userId: string;
  startedAt: Date;
  finishedAt: Date | null;
  score: number;
  totalCorrect: number;
  totalWrong: number;
  totalTimeSeconds: number;
  totalQuestions?: number;

  constructor(attempt: ExamAttemptEntity, totalQuestions?: number) {
    this.id = attempt.id;
    this.examId = attempt.examId;
    this.userId = attempt.userId;
    this.startedAt = attempt.startedAt;
    this.finishedAt = attempt.finishedAt;
    this.score = attempt.score;
    this.totalCorrect = attempt.totalCorrect;
    this.totalWrong = attempt.totalWrong;
    this.totalTimeSeconds = attempt.totalTimeSeconds;
    this.totalQuestions = totalQuestions;
  }
}

export class ExamResultResponse extends ExamAttemptResponse {
  examTitle: string;
  institution: string;
  year: number;

  constructor(output: GetExamAttemptOutput) {
    super(output.attempt, output.totalQuestions);
    this.examTitle = output.exam.title;
    this.institution = output.exam.institution;
    this.year = output.exam.year;
  }
}
