import { ExamSectionEntity } from '../entities/exam-section.entity';

export abstract class ExamSectionsRepository {
  abstract create(section: ExamSectionEntity): Promise<ExamSectionEntity>;

  abstract findByExam(examId: string): Promise<ExamSectionEntity[]>;

  abstract findById(id: string): Promise<ExamSectionEntity | null>;

  abstract getNextOrder(examId: string): Promise<number>;

  abstract delete(id: string): Promise<void>;

  abstract assignQuestionsToSection(
    examId: string,
    sectionId: string,
    questionIds: string[],
  ): Promise<void>;
}

export const EXAM_SECTIONS_REPOSITORY = Symbol('EXAM_SECTIONS_REPOSITORY');
