import { TagEntity } from '../entities/tag.entity';

export abstract class TagsRepository {
  abstract create(name: string): Promise<TagEntity>;

  abstract findById(id: string): Promise<TagEntity | null>;

  abstract findByName(name: string): Promise<TagEntity | null>;

  abstract findMany(): Promise<TagEntity[]>;

  abstract delete(id: string): Promise<void>;

  abstract attachToQuestion(tagId: string, questionId: string): Promise<void>;

  abstract attachToGroup(tagId: string, groupId: string): Promise<void>;

  abstract detachFromQuestion(tagId: string, questionId: string): Promise<void>;

  abstract detachFromGroup(tagId: string, groupId: string): Promise<void>;

  abstract syncQuestionTags(questionId: string, tagNames: string[]): Promise<void>;

  abstract syncGroupTags(groupId: string, tagNames: string[]): Promise<void>;

  abstract findNamesByQuestionId(questionId: string): Promise<string[]>;

  abstract findNamesByGroupId(groupId: string): Promise<string[]>;

  abstract findByQuestionId(questionId: string): Promise<TagEntity[]>;

  abstract findByGroupId(groupId: string): Promise<TagEntity[]>;
}

export const TAGS_REPOSITORY = Symbol('TAGS_REPOSITORY');
