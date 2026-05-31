export type UserRoleValue = 'student' | 'instructor' | 'admin';

export class UserRole {
  private constructor(private readonly value: UserRoleValue) {}

  static create(role: string): UserRole {
    const allowed: UserRoleValue[] = ['student', 'instructor', 'admin'];
    if (!allowed.includes(role as UserRoleValue)) {
      throw new Error(`Invalid user role: ${role}`);
    }
    return new UserRole(role as UserRoleValue);
  }

  static student(): UserRole {
    return new UserRole('student');
  }

  getValue(): UserRoleValue {
    return this.value;
  }
}
