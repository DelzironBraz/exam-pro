import { UserRole, UserRoleValue } from '../value-objects/user-role.vo';

export class User {
  id: string;
  name: string;
  email: string;
  role: UserRoleValue;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  getRole(): UserRole {
    return UserRole.create(this.role);
  }
}
