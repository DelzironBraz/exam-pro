import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../users/domain/repositories/user.repository.interface';
import { UserRoleValue } from '../../../users/domain/value-objects/user-role.vo';
import { JwtPayload } from '../../domain/entities/jwt-payload.entity';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRoleValue;
}

export interface LoginResult {
  accessToken: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const record = await this.userRepository.findAuthByEmail(email);
    if (!record?.passwordHash) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(password, record.passwordHash);
    if (!passwordMatches) {
      return null;
    }

    return {
      id: record.id,
      email: record.email,
      name: record.name,
      role: record.role,
    };
  }

  async login(user: AuthUser): Promise<LoginResult> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
