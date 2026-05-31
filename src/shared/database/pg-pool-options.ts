import type { PoolConfig } from 'pg';
import { normalizeDatabaseUrl } from './normalize-database-url';

/** Pool config for Prisma adapter — Supabase/Render need SSL + IPv4 (no IPv6 route). */
export function createPgPoolConfig(connectionString: string): PoolConfig {
  const normalized = normalizeDatabaseUrl(connectionString);

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    return { connectionString: normalized };
  }

  const isSupabase = url.hostname.includes('supabase.co');
  const needsSsl =
    isSupabase ||
    /sslmode=(require|verify-full|prefer)/i.test(normalized);

  const port = url.port ? Number(url.port) : 5432;
  const database = url.pathname.replace(/^\//, '') || 'postgres';

  const config: PoolConfig = {
    host: url.hostname,
    port,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    ...(needsSsl && {
      ssl: { rejectUnauthorized: false },
      family: 4 as const,
    }),
  };

  return config;
}
