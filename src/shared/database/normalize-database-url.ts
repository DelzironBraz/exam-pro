/** Pooler padrão (sa-east-1). Sobrescreva com SUPABASE_POOLER_HOST em outros regions. */
const DEFAULT_SUPABASE_POOLER_HOST = 'aws-1-sa-east-1.pooler.supabase.com';

/**
 * No Render, DATABASE_URL com host db.*.supabase.co:5432 resolve em IPv6 (ENETUNREACH).
 * Reescreve automaticamente para o pooler (6543).
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

  const projectRef = url.hostname.slice(3, -'.supabase.co'.length);
  const poolerHost =
    process.env.SUPABASE_POOLER_HOST?.trim() || DEFAULT_SUPABASE_POOLER_HOST;

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

export function getDatabaseHostForLog(connectionString: string): string {
  try {
    return new URL(normalizeDatabaseUrl(connectionString)).host;
  } catch {
    return '(invalid DATABASE_URL)';
  }
}
