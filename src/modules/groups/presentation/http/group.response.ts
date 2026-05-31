import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';

export class GroupResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: GroupType;
  visibility: GroupVisibility;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];

  constructor(group: GroupEntity, tags: string[] = []) {
    this.id = group.id;
    this.name = group.name;
    this.slug = group.slug;
    this.description = group.description;
    this.type = group.type;
    this.visibility = group.visibility;
    this.ownerId = group.ownerId;
    this.createdAt = group.createdAt;
    this.updatedAt = group.updatedAt;
    this.tags = tags;
  }

  static from(group: GroupEntity, tags: string[] = []): GroupResponse {
    return new GroupResponse(group, tags);
  }

  static fromList(groups: GroupEntity[]): GroupResponse[] {
    return groups.map((group) => GroupResponse.from(group));
  }
}
