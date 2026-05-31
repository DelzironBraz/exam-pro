import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  getPort(): number {
    return Number(this.configService.get<number>('PORT', 3000));
  }

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL', '');
  }

  getPostgresUser(): string {
    return this.configService.get<string>('POSTGRES_USER', '');
  }

  getPostgresPassword(): string {
    return this.configService.get<string>('POSTGRES_PASSWORD', '');
  }

  getPostgresDb(): string {
    return this.configService.get<string>('POSTGRES_DB', '');
  }

  getPostgresPort(): number {
    return Number(this.configService.get<number>('POSTGRES_PORT', 5432));
  }

  getPostgresHost(): string {
    return this.configService.get<string>('POSTGRES_HOST', 'localhost');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', '');
  }

  getJwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '1d');
  }

  isJuriswayEnabled(): boolean {
    const enabled = this.configService.get<string>('JURISWAY_ENABLED', 'false');
    return enabled === 'true' || enabled === '1';
  }

  getJuriswayBaseUrl(): string {
    return (
      this.configService.get<string>(
        'JURISWAY_BASE_URL',
        'https://www.jurisway.org.br/provasoab/oab2afase.asp',
      ) ?? 'https://www.jurisway.org.br/provasoab/oab2afase.asp'
    );
  }

  getJuriswayGroupId(): string {
    const groupId = this.configService.get<string>('JURISWAY_GROUP_ID', '');
    if (!groupId && this.isJuriswayEnabled()) {
      throw new Error('JURISWAY_GROUP_ID is required when JURISWAY_ENABLED=true');
    }
    return groupId;
  }

  getJuriswayCreatedByUserId(): string | undefined {
    return this.configService.get<string>('JURISWAY_CREATED_BY_USER_ID');
  }

  getJuriswayDelayMs(): number {
    return Number(this.configService.get<string>('JURISWAY_DELAY_MS', '1500'));
  }

  getJuriswayMaterias(): string[] {
    const raw = this.configService.get<string>('JURISWAY_MATERIAS', 'Direito_Penal');
    return raw
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
  }
}
