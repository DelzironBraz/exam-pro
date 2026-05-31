import type { PoolConfig } from 'pg';

/** Pool config for Prisma adapter — Supabase/Render need SSL + IPv4 (no IPv6 route). */
export function createPgPoolConfig(connectionString: string): PoolConfig {
  const isSupabase = connectionString.includes('supabase.co');
  const needsSsl =
    isSupabase ||
    /sslmode=(require|verify-full|prefer)/i.test(connectionString);

  return {
    connectionString,
    ...(needsSsl && {
      ssl: { rejectUnauthorized: false },
      // Render não alcança db.*.supabase.co via IPv6 (ENETUNREACH)
      family: 4 as const,
    }),
  };
}
