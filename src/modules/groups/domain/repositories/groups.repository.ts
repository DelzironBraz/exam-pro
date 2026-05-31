import { GroupEntity } from '../entities/group.entity';
import { GroupType } from '../enums/group-type.enum';
import { GroupVisibility } from '../enums/group-visibility.enum';

export interface FindGroupsFilters {
  type?: GroupType;
  visibility?: GroupVisibility;
  ownerId?: string;
}

export abstract class GroupsRepository {
  abstract create(group: GroupEntity): Promise<GroupEntity>;

  abstract findById(id: string): Promise<GroupEntity | null>;

  abstract findBySlug(slug: string): Promise<GroupEntity | null>;

  abstract findMany(filters?: FindGroupsFilters): Promise<GroupEntity[]>;

  abstract update(group: GroupEntity): Promise<GroupEntity>;

  abstract delete(id: string): Promise<void>;
}

export const GROUPS_REPOSITORY = Symbol('GROUPS_REPOSITORY');
