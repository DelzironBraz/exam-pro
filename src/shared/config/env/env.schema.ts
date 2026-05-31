import { plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';

export class EnvSchema {
  @IsString()
  NODE_ENV: string;

  @IsNumber()
  PORT: number;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  @IsOptional()
  POSTGRES_HOST?: string;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string;

  @IsString()
  @IsOptional()
  JURISWAY_ENABLED?: string;

  @IsString()
  @IsOptional()
  JURISWAY_BASE_URL?: string;

  @IsString()
  @IsOptional()
  JURISWAY_GROUP_ID?: string;

  @IsString()
  @IsOptional()
  JURISWAY_CREATED_BY_USER_ID?: string;

  @IsString()
  @IsOptional()
  JURISWAY_DELAY_MS?: string;

  @IsString()
  @IsOptional()
  JURISWAY_MATERIAS?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
