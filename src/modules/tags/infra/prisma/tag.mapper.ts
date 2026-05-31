import { Tag as PrismaTag } from '../../../../generated/prisma';
import { TagEntity } from '../../domain/entities/tag.entity';

export class TagMapper {
  static toDomain(record: PrismaTag): TagEntity {
    return new TagEntity(record.id, record.name);
  }
}
