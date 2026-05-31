import { UserRoleValue } from '../../../users/domain/value-objects/user-role.vo';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRoleValue;
}
