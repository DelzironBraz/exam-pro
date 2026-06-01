-- Admin: admin@offensive.world / senha: admin123
-- Rode no SQL Editor do Supabase ou: psql "$DATABASE_URL" -f scripts/sql/create-admin-user.sql

INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@offensive.world',
  '$2b$10$oQfLoBWHieGd.6MK7QzxvOydlc7L0JSdnI/Lqge/cDx/rSn1Kcvsq',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  name          = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role          = EXCLUDED.role,
  updated_at    = NOW();
