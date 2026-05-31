import { User as PrismaUser } from '../../../../generated/prisma';
import { User } from '../../domain/entities/user.entity';
import { UserRoleValue } from '../../domain/value-objects/user-role.vo';

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return new User({
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role as UserRoleValue,
      avatarUrl: record.avatarUrl,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
