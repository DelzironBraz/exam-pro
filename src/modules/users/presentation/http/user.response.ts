import { User } from '../../domain/entities/user.entity';

export class UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static from(user: User): UserResponse {
    return new UserResponse(user);
  }

  static fromList(users: User[]): UserResponse[] {
    return users.map((user) => UserResponse.from(user));
  }
}
