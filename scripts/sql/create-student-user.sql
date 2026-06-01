-- Student: student@offensive.world / senha: student123
-- Rode no SQL Editor do Supabase ou: psql "$DATABASE_URL" -f scripts/sql/create-student-user.sql

INSERT INTO users (id, name, email, password_hash, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Student',
  'student@offensive.world',
  '$2b$10$sr77PGXU5vPSCttmiysKZ.FDf4rijN4C/yrrF0GxePXzAlrKH7BZW',
  'student',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  name          = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role          = EXCLUDED.role,
  updated_at    = NOW();
