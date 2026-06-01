import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { TagEntity } from '../entities/tag.entity';

export abstract class TagsRepository {
  abstract create(name: string): Promise<TagEntity>;

  abstract findById(id: string): Promise<TagEntity | null>;

  abstract findByName(name: string): Promise<TagEntity | null>;

  abstract findMany(pagination: PaginationParams): Promise<TagEntity[]>;

  abstract count(): Promise<number>;

  abstract delete(id: string): Promise<void>;

  abstract attachToQuestion(tagId: string, questionId: string): Promise<void>;

  abstract attachToGroup(tagId: string, groupId: string): Promise<void>;

  abstract detachFromQuestion(tagId: string, questionId: string): Promise<void>;

  abstract detachFromGroup(tagId: string, groupId: string): Promise<void>;

  abstract syncQuestionTags(questionId: string, tagNames: string[]): Promise<void>;

  abstract syncGroupTags(groupId: string, tagNames: string[]): Promise<void>;

  abstract findNamesByQuestionId(questionId: string): Promise<string[]>;

  abstract findNamesByGroupId(groupId: string): Promise<string[]>;

  abstract findAllByQuestionId(questionId: string): Promise<TagEntity[]>;

  abstract findByQuestionId(
    questionId: string,
    pagination: PaginationParams,
  ): Promise<TagEntity[]>;

  abstract countByQuestionId(questionId: string): Promise<number>;

  abstract findAllByGroupId(groupId: string): Promise<TagEntity[]>;

  abstract findByGroupId(
    groupId: string,
    pagination: PaginationParams,
  ): Promise<TagEntity[]>;

  abstract countByGroupId(groupId: string): Promise<number>;
}

export const TAGS_REPOSITORY = Symbol('TAGS_REPOSITORY');
