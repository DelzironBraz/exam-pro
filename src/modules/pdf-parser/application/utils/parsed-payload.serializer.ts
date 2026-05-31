import { ParsedAlternativeEntity } from '../../domain/entities/parsed-alternative.entity';
import { ParsedQuestionEntity } from '../../domain/entities/parsed-question.entity';
import {
  ParsedStudyPlanEntity,
  ParsedStudyPlanItemEntity,
} from '../../domain/entities/parsed-study-plan.entity';

export interface SerializedParsedAlternative {
  label: string;
  content: string;
  isCorrect: boolean;
}

export interface SerializedParsedQuestion {
  statement: string;
  alternatives: SerializedParsedAlternative[];
  discipline?: string;
  topic?: string;
}

export interface SerializedParsedStudyPlan {
  title: string;
  items: { title: string; description: string; estimatedHours: number }[];
}

export interface ExamParsePayload {
  kind: 'exam';
  questions: SerializedParsedQuestion[];
  validation?: { valid: boolean; issues: { questionIndex: number; message: string }[] };
}

export interface StudyPlanParsePayload {
  kind: 'study_plan';
  plan: SerializedParsedStudyPlan;
}

export type ParsePayload = ExamParsePayload | StudyPlanParsePayload;

export function serializeParsedQuestions(
  questions: ParsedQuestionEntity[],
): SerializedParsedQuestion[] {
  return questions.map((q) => ({
    statement: q.statement,
    discipline: q.discipline,
    topic: q.topic,
    alternatives: q.alternatives.map((a) => ({
      label: a.label,
      content: a.content,
      isCorrect: a.isCorrect,
    })),
  }));
}

export function deserializeParsedQuestions(
  payload: SerializedParsedQuestion[],
): ParsedQuestionEntity[] {
  return payload.map(
    (q) =>
      new ParsedQuestionEntity(
        q.statement,
        q.alternatives.map(
          (a) => new ParsedAlternativeEntity(a.label, a.content, a.isCorrect),
        ),
        q.discipline,
        q.topic,
      ),
  );
}

export function serializeParsedStudyPlan(plan: ParsedStudyPlanEntity): SerializedParsedStudyPlan {
  return {
    title: plan.title,
    items: plan.items.map((i) => ({
      title: i.title,
      description: i.description,
      estimatedHours: i.estimatedHours,
    })),
  };
}

export function deserializeParsedStudyPlan(
  data: SerializedParsedStudyPlan,
): ParsedStudyPlanEntity {
  return new ParsedStudyPlanEntity(
    data.title,
    data.items.map(
      (i) => new ParsedStudyPlanItemEntity(i.title, i.description, i.estimatedHours),
    ),
  );
}
