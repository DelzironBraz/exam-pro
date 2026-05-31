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
    const pooler = this.configService.get<string>('DATABASE_POOLER_URL', '');
    if (pooler?.trim()) {
      return pooler.trim();
    }
    return this.configService.get<string>('DATABASE_URL', '');
  }

  getSupabasePoolerHost(): string | undefined {
    const host = this.configService.get<string>('SUPABASE_POOLER_HOST', '');
    return host?.trim() || undefined;
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

  /** Quando true, não baixa de novo questões já em import_sources (retomada rápida). */
  isJuriswaySkipUnchangedFetch(): boolean {
    const value = this.configService.get<string>('JURISWAY_SKIP_UNCHANGED_FETCH', 'true');
    return value === 'true' || value === '1';
  }

  getJuriswayHttpProxy(): string | undefined {
    const proxy = this.configService.get<string>('JURISWAY_HTTP_PROXY');
    return proxy?.trim() || undefined;
  }
}
