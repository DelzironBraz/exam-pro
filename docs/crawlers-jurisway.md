# Crawler JurisWay — OAB 2ª Fase

Importação automática de questões dissertativas do site [JurisWay](https://www.jurisway.org.br/provasoab/oab2afase.asp).

## Configuração

1. Crie um **Group** para OAB (via `POST /groups`) e copie o UUID.
2. Aplique a migration `20260530300000_init_import_sources`.
3. Configure o `.env`:

```env
JURISWAY_ENABLED=true
JURISWAY_BASE_URL=https://www.jurisway.org.br/provasoab/oab2afase.asp
JURISWAY_GROUP_ID=<uuid-do-grupo>
JURISWAY_DELAY_MS=1500
JURISWAY_MATERIAS=Direito_Penal,Direito_Civil
# opcional:
# JURISWAY_CREATED_BY_USER_ID=<uuid-admin>
```

4. Reinicie a API.

## Execução manual (admin)

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@offensive.world","password":"admin123"}' \
  | jq -r '.data.accessToken')

# Uma matéria
curl -X POST http://localhost:3000/crawlers/jurisway/sync/Direito_Penal \
  -H "Authorization: Bearer $TOKEN"

# Todas as matérias configuradas
curl -X POST http://localhost:3000/crawlers/jurisway/sync \
  -H "Authorization: Bearer $TOKEN"
```

## Cron

`0 3 * * 0` — todo domingo às 03:00, se `JURISWAY_ENABLED=true`.

## Fluxo

1. GET página índice (`?materia=...`)
2. Para cada `id_questao`: GET individual, SHA-256 do HTML
3. Skip se checksum igual em `import_sources`
4. Cria/atualiza `Question` (sem alternativas, `explanation` = padrão FGV)
5. Agrupa por exame (`Exam`) com título único

## Tabela `import_sources`

| Campo | Uso |
|-------|-----|
| `source` | `jurisway` |
| `external_id` | ID numérico JurisWay |
| `checksum` | SHA-256 do HTML |
| `question_id` | vínculo para reimportação |
