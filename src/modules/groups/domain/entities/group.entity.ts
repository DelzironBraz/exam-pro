import { GroupType } from '../enums/group-type.enum';
import { GroupVisibility } from '../enums/group-visibility.enum';

export class GroupEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly slug: string,
    readonly description: string | null,
    readonly type: GroupType,
    readonly visibility: GroupVisibility,
    readonly ownerId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
