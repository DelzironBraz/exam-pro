import { BaseRepository } from '../../../../shared/domain/repositories/base.repository.interface';
import { User } from '../entities/user.entity';
import { UserRoleValue } from '../value-objects/user-role.vo';

export interface CreateUserData {
  name: string;
  email: string;
  passwordHash?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  passwordHash?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

export interface UserAuthRecord {
  id: string;
  name: string;
  email: string;
  role: UserRoleValue;
  passwordHash: string | null;
}

export interface UserRepository extends BaseRepository<
  User,
  CreateUserData,
  UpdateUserData
> {
  findByEmail(email: string): Promise<User | null>;
  findAuthByEmail(email: string): Promise<UserAuthRecord | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
