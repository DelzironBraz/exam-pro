import { Group as PrismaGroup } from '../../../../generated/prisma';
import { GroupEntity } from '../../domain/entities/group.entity';
import { GroupType } from '../../domain/enums/group-type.enum';
import { GroupVisibility } from '../../domain/enums/group-visibility.enum';

export class GroupMapper {
  static toDomain(record: PrismaGroup): GroupEntity {
    return new GroupEntity(
      record.id,
      record.name,
      record.slug,
      record.description,
      record.type as GroupType,
      record.visibility as GroupVisibility,
      record.ownerId,
      record.createdAt,
      record.updatedAt,
    );
  }
}
