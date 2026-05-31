import type { PoolConfig } from 'pg';
import { normalizeDatabaseUrl } from './normalize-database-url';

/** Pool config for Prisma adapter — Supabase/Render need SSL + IPv4 (no IPv6 route). */
export function createPgPoolConfig(connectionString: string): PoolConfig {
  const normalized = normalizeDatabaseUrl(connectionString);
  const isSupabase = normalized.includes('supabase.co');
  const needsSsl =
    isSupabase ||
    /sslmode=(require|verify-full|prefer)/i.test(connectionString);

  return {
    connectionString: normalized,
    ...(needsSsl && {
      ssl: { rejectUnauthorized: false },
      // Render não alcança db.*.supabase.co via IPv6 (ENETUNREACH)
      family: 4 as const,
    }),
  };
}
