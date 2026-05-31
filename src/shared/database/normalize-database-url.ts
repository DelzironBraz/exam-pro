/**
 * No Render, DATABASE_URL com host db.*.supabase.co:5432 resolve em IPv6 (ENETUNREACH).
 * Use pooler (6543) ou defina SUPABASE_POOLER_HOST para reescrever automaticamente.
 */
export function normalizeDatabaseUrl(connectionString: string): string {
  const poolerOverride = process.env.DATABASE_POOLER_URL?.trim();
  if (poolerOverride) {
    return poolerOverride;
  }

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    return connectionString;
  }

  const isDirectHost =
    url.hostname.startsWith('db.') && url.hostname.endsWith('.supabase.co');

  if (!isDirectHost) {
    return connectionString;
  }

  const poolerHost = process.env.SUPABASE_POOLER_HOST?.trim();
  if (!poolerHost) {
    return connectionString;
  }

  const projectRef = url.hostname.slice(3, -'.supabase.co'.length);
  url.hostname = poolerHost;
  url.port = process.env.SUPABASE_POOLER_PORT?.trim() || '6543';
  url.searchParams.set('pgbouncer', 'true');

  if (url.username === 'postgres') {
    url.username = `postgres.${projectRef}`;
  }

  return url.toString();
}

export function usesSupabaseDirectHost(connectionString: string): boolean {
  try {
    const url = new URL(connectionString);
    return (
      url.hostname.startsWith('db.') &&
      url.hostname.endsWith('.supabase.co') &&
      (url.port === '5432' || url.port === '')
    );
  } catch {
    return false;
  }
}
