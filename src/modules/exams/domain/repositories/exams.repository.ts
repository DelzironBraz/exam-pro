import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { ExamEntity } from '../entities/exam.entity';

export interface ExamQuestionLink {
  questionId: string;
  sectionId?: string | null;
  sortOrder?: number;
}

export interface ExamQuestionLinkRow {
  questionId: string;
  sectionId: string | null;
  sortOrder: number;
}

export abstract class ExamsRepository {
  abstract create(exam: ExamEntity): Promise<ExamEntity>;

  abstract findById(id: string): Promise<ExamEntity | null>;

  abstract findManyByGroup(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<ExamEntity[]>;

  abstract countByGroup(groupId: string): Promise<number>;

  abstract countQuestionsByExamIds(examIds: string[]): Promise<Map<string, number>>;

  abstract findByGroupAndTitle(groupId: string, title: string): Promise<ExamEntity | null>;

  abstract appendQuestions(examId: string, links: ExamQuestionLink[]): Promise<void>;

  abstract update(exam: ExamEntity): Promise<ExamEntity>;

  abstract delete(id: string): Promise<void>;

  abstract setQuestions(examId: string, links: ExamQuestionLink[]): Promise<void>;

  abstract findQuestionIds(examId: string): Promise<string[]>;

  abstract findQuestionLinksPaginated(
    examId: string,
    pagination: PaginationParams,
  ): Promise<ExamQuestionLinkRow[]>;

  abstract countQuestions(examId: string): Promise<number>;
}

export const EXAMS_REPOSITORY = Symbol('EXAMS_REPOSITORY');
