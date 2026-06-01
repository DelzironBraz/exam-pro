import { Injectable } from '@nestjs/common';
import { PaginationParams } from '../../../../shared/application/types/pagination.types';
import { toPrismaPagination } from '../../../../shared/application/utils/pagination.util';
import { PrismaRepository } from '../../../../shared/database/prisma/prisma.repository';
import { PrismaService } from '../../../../shared/database/prisma/prisma.service';
import { User } from '../../domain/entities/user.entity';
import {
  CreateUserData,
  UpdateUserData,
  UserAuthRecord,
  UserRepository,
} from '../../domain/repositories/user.repository.interface';
import { UserRoleValue } from '../../domain/value-objects/user-role.vo';
import { UserMapper } from '../prisma/user.mapper';

@Injectable()
export class PrismaUserRepository
  extends PrismaRepository
  implements UserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(data: CreateUserData): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role ?? 'student',
        avatarUrl: data.avatarUrl,
      },
    });
    return UserMapper.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async findMany(pagination: PaginationParams): Promise<User[]> {
    const { skip, take } = toPrismaPagination(pagination);
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return users.map((user) => UserMapper.toDomain(user));
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        avatarUrl: data.avatarUrl,
      },
    });
    return UserMapper.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async findAuthByEmail(email: string): Promise<UserAuthRecord | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as UserRoleValue,
      passwordHash: user.passwordHash,
    };
  }
}
