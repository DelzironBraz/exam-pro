# API — Referência de Endpoints

Documentação de todos os endpoints da **Offensive World API**, com entradas, saídas e regras de acesso.

## Índice

1. [Convenções gerais](#convenções-gerais)
2. [Auth](#auth)
3. [Users](#users)
4. [Groups](#groups)
5. [Questions](#questions)
6. [Tags](#tags)
7. [Simulations](#simulations)
8. [Flashcards](#flashcards)
9. [Study Plans](#study-plans)
10. [Exams](#exams)
11. [PDF Parser](#pdf-parser)
12. [Analytics](#analytics)
13. [Crawlers — JurisWay](#crawlers--jurisway)

---

## Convenções gerais

| Item | Valor |
|------|--------|
| Base URL | `http://localhost:3000` (dev) |
| Prefixo da API | `/api` |
| Swagger UI | `http://localhost:3000/api/docs` |
| Formato | JSON (`Content-Type: application/json`), exceto uploads PDF |
| Autenticação | `Authorization: Bearer <accessToken>` (JWT) |
| IDs | UUID v4 |

### Envelope de resposta (sucesso)

Todas as respostas HTTP bem-sucedidas passam pelo `ResponseInterceptor`:

```json
{
  "success": true,
  "data": { },
  "timestamp": "2026-05-30T12:00:00.000Z"
}
```

O campo **`data`** contém o payload descrito em cada endpoint abaixo.

### Erros

Erros HTTP retornam corpo com `success: false`, `message` e `statusCode` (via `AllExceptionsFilter`). Códigos comuns: `400`, `401`, `403`, `404`, `409`.

### Papéis (`role`)

| Valor | Descrição |
|-------|-----------|
| `admin` | CRUD administrativo, importação PDF, analytics por questão |
| `instructor` | (reservado) |
| `student` | Uso padrão: responder questões, simulados, provas, dashboard |

### Legenda de acesso

- **Público** — sem token
- **Autenticado** — qualquer usuário logado
- **Admin** — `role: admin` + guards `JwtAuthGuard`, `RolesGuard`, `AdminGuard`

### Paginação (endpoints de listagem)

Todos os endpoints `GET` que **listam coleções** aceitam paginação via query string:

| Parâmetro | Tipo | Default | Limites |
|-----------|------|---------|---------|
| `page` | int | `1` | mínimo `1` |
| `limit` | int | `20` | mínimo `1`, máximo `100` |

**Saída paginada (`data`)**

```json
{
  "items": [ /* ... */ ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8
}
```

> Endpoints de mutação que retornam listas completas (ex.: sync/attach de tags) **não** usam paginação — retornam `TagResponse[]` diretamente dentro de `data`.

---

## Auth

### `POST /auth/login` — Público

Autentica com e-mail e senha (Passport Local).

**Entrada (body)**

```json
{
  "email": "admin@offensive.world",
  "password": "admin123"
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `email` | string (email) | sim |
| `password` | string (min 6) | sim |

**Saída (`data`)**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "admin@offensive.world",
    "name": "Admin",
    "role": "admin"
  }
}
```

---

## Users

> Todos os endpoints exigem **Admin** + Bearer token.

### `POST /users` — Criar usuário

**Entrada (body)**

```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "secret123",
  "role": "student",
  "avatarUrl": "https://example.com/avatar.png"
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | string (max 120) | sim |
| `email` | string (email) | sim |
| `password` | string (min 6) | não |
| `role` | `student` \| `instructor` \| `admin` | não (default: `student`) |
| `avatarUrl` | string (URL) | não |

**Saída (`data`)** — `UserResponse`

```json
{
  "id": "uuid",
  "name": "João Silva",
  "email": "joao@example.com",
  "role": "student",
  "avatarUrl": null,
  "createdAt": "2026-05-30T12:00:00.000Z",
  "updatedAt": "2026-05-30T12:00:00.000Z"
}
```

### `GET /users` — Listar usuários (paginado)

**Entrada (query)** — todos opcionais

| Parâmetro | Tipo | Default |
|-----------|------|---------|
| `page` | int | `1` |
| `limit` | int | `20` (max `100`) |

**Saída (`data`)** — resposta paginada de `UserResponse`

### `GET /users/:id` — Buscar usuário

**Entrada (params)** — `id`: UUID

**Saída (`data`)** — `UserResponse`

### `PATCH /users/:id` — Atualizar usuário

**Entrada (body)** — todos opcionais: `name`, `email`, `password`, `role`, `avatarUrl`

**Saída (`data`)** — `UserResponse`

### `DELETE /users/:id` — Remover usuário

**Saída (`data`)**

```json
{ "message": "User deleted successfully" }
```

---

## Groups

> Todos os endpoints exigem **Admin**.

### `POST /groups` — Criar grupo

**Entrada (body)**

```json
{
  "name": "Concurso TJ-SP",
  "description": "Preparação para o concurso",
  "type": "contest",
  "visibility": "public",
  "tags": ["concurso", "tj-sp"]
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `name` | string (max 120) | sim |
| `description` | string | não |
| `type` | `contest` \| `technology` \| `language` \| `custom` | sim |
| `visibility` | `public` \| `private` | sim |
| `tags` | string[] | não |

> `ownerId` é definido automaticamente pelo usuário autenticado.

**Saída (`data`)** — `GroupResponse`

```json
{
  "id": "uuid",
  "name": "Concurso TJ-SP",
  "slug": "concurso-tj-sp",
  "description": "...",
  "type": "contest",
  "visibility": "public",
  "ownerId": "uuid",
  "createdAt": "...",
  "updatedAt": "...",
  "tags": ["concurso", "tj-sp"]
}
```

### `GET /groups` — Listar grupos (paginado)

**Entrada (query)** — todos opcionais

| Parâmetro | Tipo |
|-----------|------|
| `page` | int (default `1`) |
| `limit` | int (default `20`, max `100`) |
| `type` | enum `GroupType` |
| `visibility` | enum `GroupVisibility` |
| `ownerId` | UUID |

**Saída (`data`)** — resposta paginada de `GroupResponse` (sem tags na listagem resumida)

### `GET /groups/:id` — Detalhe do grupo

**Saída (`data`)** — `GroupResponse` (com `tags`)

### `PATCH /groups/:id` — Atualizar grupo

**Entrada (body)** — opcionais: `name`, `description`, `visibility`

**Saída (`data`)** — `GroupResponse`

### `DELETE /groups/:id` — Remover grupo

**Saída (`data`)**

```json
{ "message": "Group deleted successfully" }
```

---

## Questions

### `POST /questions` — **Admin**

**Entrada (body)**

```json
{
  "statement": "Qual é a capital do Brasil?",
  "groupId": "uuid",
  "discipline": "Geografia",
  "topic": "Capitais",
  "difficulty": "medium",
  "type": "multiple_choice",
  "explanation": "Brasília foi fundada em 1960.",
  "alternatives": [
    { "label": "A", "content": "São Paulo", "isCorrect": false },
    { "label": "B", "content": "Brasília", "isCorrect": true }
  ],
  "tags": ["geografia", "enem"]
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `statement` | string | sim |
| `groupId` | UUID | sim |
| `discipline` | string (max 120) | não |
| `topic` | string (max 120) | não |
| `difficulty` | `easy` \| `medium` \| `hard` | sim |
| `type` | `multiple_choice` (padrão) \| `discursive` | não |
| `referenceAnswer` | string | obrigatório se `type=discursive` |
| `explanation` | string | não |
| `alternatives` | array (min 2) | obrigatório se `multiple_choice`; omitir se `discursive` |
| `alternatives[].label` | string (max 10) | sim |
| `alternatives[].content` | string | sim |
| `alternatives[].isCorrect` | boolean | sim |
| `tags` | string[] | não |

**Saída (`data`)** — `QuestionResponse` (admin vê `isCorrect` e `explanation`)

```json
{
  "id": "uuid",
  "statement": "...",
  "groupId": "uuid",
  "discipline": "Geografia",
  "topic": "Capitais",
  "difficulty": "medium",
  "type": "multiple_choice",
  "explanation": "...",
  "createdBy": "uuid",
  "createdAt": "...",
  "tags": ["geografia"],
  "alternatives": [
    { "id": "uuid", "label": "A", "content": "...", "isCorrect": false }
  ]
}
```

> Questões **discursivas** (`type: discursive`) não possuem `alternatives`; o gabarito fica em `referenceAnswer`.  
> Questões existentes **sem alternativas** foram migradas automaticamente para discursivas.

### `GET /questions` — **Autenticado** (paginado)

**Entrada (query)** — todos opcionais

| Parâmetro | Tipo |
|-----------|------|
| `page` | int (default `1`) |
| `limit` | int (default `20`, max `100`) |
| `groupId` | UUID |
| `discipline` | string |
| `topic` | string |
| `difficulty` | `easy` \| `medium` \| `hard` |
| `tags` | string (vírgula: `enem,matematica`) |

**Saída (`data`)**

```json
{
  "items": [
    {
      "id": "...",
      "statement": "...",
      "groupId": "...",
      "discipline": "Geografia",
      "topic": "Capitais",
      "difficulty": "medium",
      "type": "multiple_choice",
      "createdBy": "...",
      "createdAt": "...",
      "tags": ["geografia"],
      "answers": [
        { "id": "...", "label": "A", "content": "..." }
      ],
      "alternatives": [
        { "id": "...", "label": "A", "content": "..." }
      ],
      "completed": true,
      "lastAnswer": {
        "selectedAlternativeId": "...",
        "isCorrect": true,
        "correctAlternativeId": "...",
        "answeredAt": "2026-05-30T12:00:00.000Z"
      },
      "explanation": "Brasília foi fundada em 1960."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

> A listagem inclui **`answers`** (e `alternatives`, alias) com as opções de resposta para responder direto na UI.  
> `completed: true` indica que o usuário logado já respondeu a questão (`POST /questions/:id/answer`).  
> Quando `completed`, cada answer inclui `isCorrect`, `explanation` é retornada e `lastAnswer.correctAlternativeId` traz o gabarito.  
> Questões **discursivas** (sem alternativas) sempre retornam `explanation` (resposta-modelo), pois não podem ser respondidas por múltipla escolha.

### `GET /questions/:id` — **Autenticado**

**Saída (`data`)** — `QuestionResponse` com alternativas; `isCorrect` e `explanation` apenas para **admin**.

### `PATCH /questions/:id` — **Admin**

**Entrada (body)** — opcionais: `statement`, `discipline`, `topic`, `difficulty`, `explanation`

**Saída (`data`)** — `QuestionResponse` (detalhe admin)

### `DELETE /questions/:id` — **Admin**

**Saída (`data`)**

```json
{ "message": "Question deleted successfully" }
```

### `POST /questions/:id/answer` — **Autenticado**

**Entrada (body)** — múltipla escolha:

```json
{
  "selectedAlternativeId": "uuid",
  "timeSpentSeconds": 45
}
```

**Entrada (body)** — discursiva:

```json
{
  "textAnswer": "Brasília é a capital federal do Brasil.",
  "timeSpentSeconds": 120
}
```

> Envie `selectedAlternativeId` **ou** `textAnswer`, conforme o `type` da questão.

**Saída (`data`)** — múltipla escolha:

```json
{
  "isCorrect": true,
  "correctAlternativeId": "uuid",
  "explanation": "Texto da explicação (se existir)"
}
```

**Saída (`data`)** — discursiva:

```json
{
  "isCorrect": true,
  "similarityScore": 0.91,
  "referenceAnswer": "Brasília é a capital federal do Brasil.",
  "explanation": "Texto da explicação (se existir)"
}
```

> Respostas discursivas são avaliadas por similaridade textual (sem IA). Score ≥ **0,72** = correto.

---

## Tags

### `POST /tags` — **Admin**

**Entrada (body)**

```json
{ "name": "enem" }
```

**Saída (`data`)** — `TagResponse`

```json
{ "id": "uuid", "name": "enem" }
```

### `GET /tags` — **Autenticado** (paginado)

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `TagResponse`

### `GET /tags/questions/:questionId` — **Autenticado** (paginado)

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `TagResponse`

### `GET /tags/groups/:groupId` — **Autenticado** (paginado)

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `TagResponse`

### `GET /tags/:id` — **Autenticado**

**Saída (`data`)** — `TagResponse`

### `DELETE /tags/:id` — **Admin**

**Saída (`data`)**

```json
{ "message": "Tag deleted successfully" }
```

### `PUT /tags/questions/:questionId` — **Admin** (sync)

Substitui todas as tags da questão.

**Entrada (body)**

```json
{ "names": ["enem", "matematica"] }
```

**Saída (`data`)** — `TagResponse[]`

### `PUT /tags/groups/:groupId` — **Admin** (sync)

**Entrada (body)** — `{ "names": string[] }`

**Saída (`data`)** — `TagResponse[]`

### `POST /tags/questions/:questionId` — **Admin** (attach)

**Entrada (body)** — `{ "tagId": "uuid" }`

**Saída (`data`)** — `TagResponse[]` (tags da questão após attach)

### `DELETE /tags/questions/:questionId/:tagId` — **Admin**

**Saída (`data`)**

```json
{ "message": "Tag detached from question" }
```

### `POST /tags/groups/:groupId` — **Admin** (attach)

**Entrada (body)** — `{ "tagId": "uuid" }`

**Saída (`data`)** — `TagResponse[]`

### `DELETE /tags/groups/:groupId/:tagId` — **Admin**

**Saída (`data`)**

```json
{ "message": "Tag detached from group" }
```

---

## Simulations

### `POST /simulations` — **Admin**

**Entrada (body)**

```json
{
  "title": "Simulado ENEM - Matemática",
  "description": "Opcional",
  "groupId": "uuid",
  "timerMode": "fixed",
  "durationMinutes": 90,
  "questionIds": ["uuid", "uuid"]
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `title` | string (max 200) | sim |
| `description` | string | não |
| `groupId` | UUID | sim |
| `timerMode` | `fixed` \| `free` | sim |
| `durationMinutes` | number (min 1) | sim se `timerMode === fixed` |
| `questionIds` | UUID[] (min 1) | sim |

**Saída (`data`)** — `SimulationResponse`

```json
{
  "id": "uuid",
  "title": "...",
  "description": null,
  "groupId": "uuid",
  "timerMode": "fixed",
  "durationMinutes": 90,
  "createdBy": "uuid",
  "createdAt": "...",
  "questionIds": ["uuid"]
}
```

### `GET /simulations` — **Autenticado** (paginado)

**Entrada (query)**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `groupId` | UUID | sim |
| `page` | int | não (default `1`) |
| `limit` | int | não (default `20`, max `100`) |

**Saída (`data`)** — resposta paginada de `SimulationResponse` (inclui `totalQuestions` por item)

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Simulado ENEM",
      "groupId": "uuid",
      "timerMode": "fixed",
      "durationMinutes": 90,
      "totalQuestions": 20,
      "createdBy": "uuid",
      "createdAt": "..."
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### `GET /simulations/:id` — **Autenticado**

**Saída (`data`)** — `SimulationResponse` (com `questionIds`)

### `GET /simulations/:id/questions` — **Autenticado** (paginado)

Lista questões da simulação para realização, com alternativas (sem gabarito) em uma única requisição paginada.

**Entrada (query)**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `page` | int | não (default `1`) |
| `limit` | int | não (default `20`, max `100`) |
| `attemptId` | UUID | não (inclui respostas salvas da tentativa) |

**Saída (`data`)**

```json
{
  "items": [
    {
      "sortOrder": 0,
      "question": {
        "id": "uuid",
        "statement": "...",
        "discipline": "Direito",
        "topic": "Penal",
        "difficulty": "medium",
        "type": "multiple_choice"
      },
      "alternatives": [
        { "id": "uuid", "label": "A", "content": "..." }
      ],
      "answers": [
        { "id": "uuid", "label": "A", "content": "..." }
      ],
      "answered": true,
      "selectedAlternativeId": "uuid",
      "answeredAt": "2026-05-30T12:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

> Use este endpoint durante a realização do simulado em vez de `GET /questions/:id` por questão.

### `DELETE /simulations/:id` — **Admin**

**Saída (`data`)**

```json
{ "message": "Simulation deleted successfully" }
```

### `POST /simulations/:id/start` — **Autenticado**

**Saída (`data`)**

```json
{
  "attempt": {
    "id": "uuid",
    "simulationId": "uuid",
    "userId": "uuid",
    "startedAt": "...",
    "finishedAt": null,
    "totalCorrect": 0,
    "totalWrong": 0,
    "totalTimeSeconds": 0,
    "totalQuestions": 20
  },
  "timer": {
    "mode": "fixed",
    "durationMinutes": 90
  }
}
```

### `POST /simulations/attempts/:attemptId/answers` — **Autenticado**

**Entrada (body)** — múltipla escolha ou discursiva (`selectedAlternativeId` **ou** `textAnswer`):

```json
{
  "questionId": "uuid",
  "selectedAlternativeId": "uuid",
  "timeSpentSeconds": 30
}
```

**Saída (`data`)**

```json
{ "isCorrect": true, "similarityScore": 0.85 }
```

> `similarityScore` só é retornado para questões discursivas.

### `POST /simulations/attempts/:attemptId/finish` — **Autenticado**

**Entrada (body)**

```json
{
  "totalCorrect": 18,
  "totalWrong": 2,
  "totalTimeSeconds": 5400
}
```

**Saída (`data`)** — `SimulationResultResponse`

```json
{
  "id": "uuid",
  "simulationId": "uuid",
  "userId": "uuid",
  "startedAt": "...",
  "finishedAt": "...",
  "totalCorrect": 18,
  "totalWrong": 2,
  "totalTimeSeconds": 5400,
  "totalQuestions": 20,
  "scorePercent": 90,
  "answers": [
    {
      "questionId": "uuid",
      "selectedAlternativeId": "uuid",
      "timeSpentSeconds": 30,
      "isCorrect": true,
      "answeredAt": "..."
    }
  ]
}
```

### `GET /simulations/attempts/:attemptId` — **Autenticado**

Retorna tentativa em andamento (`SimulationAttemptResponse`) ou resultado final (`SimulationResultResponse` se `finishedAt` preenchido).

---

## Flashcards

### `POST /flashcards` — **Admin**

**Entrada (body)**

```json
{
  "groupId": "uuid",
  "frontContent": "O que é fotossíntese?",
  "backContent": "Processo de conversão de luz em energia.",
  "difficulty": 2
}
```

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `groupId` | UUID | sim |
| `frontContent` | string | sim |
| `backContent` | string | sim |
| `difficulty` | int 1–5 | não |

**Saída (`data`)** — `FlashcardResponse`

### `GET /flashcards/pending` — **Autenticado** (paginado)

Cards pendentes de revisão (somente frente, sem `backContent`).

**Entrada (query)** — todos opcionais

| Parâmetro | Tipo |
|-----------|------|
| `groupId` | UUID |
| `page` | int (default `1`) |
| `limit` | int (default `20`, max `100`) |

**Saída (`data`)** — resposta paginada de `FlashcardStudyResponse`

```json
{
  "items": [
    {
      "id": "uuid",
      "groupId": "uuid",
      "frontContent": "...",
      "difficulty": 2
    }
  ],
  "total": 5,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### `GET /flashcards` — **Autenticado** (paginado)

**Entrada (query)**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `groupId` | UUID | sim |
| `page` | int | não |
| `limit` | int | não |

**Saída (`data`)** — resposta paginada de `FlashcardResponse`

### `GET /flashcards/:id` — **Autenticado**

**Saída (`data`)** — `FlashcardResponse` (frente e verso)

### `PATCH /flashcards/:id` — **Admin**

**Entrada (body)** — opcionais: `frontContent`, `backContent`, `difficulty`

**Saída (`data`)** — `FlashcardResponse`

### `DELETE /flashcards/:id` — **Admin**

**Saída (`data`)**

```json
{ "message": "Flashcard deleted successfully" }
```

### `POST /flashcards/:id/review` — **Autenticado**

**Entrada (body)**

```json
{ "score": 4 }
```

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `score` | int 1–5 | 1 = difícil, 5 = fácil |

**Saída (`data`)**

```json
{ "message": "Review recorded successfully" }
```

---

## Study Plans

> Todos exigem **Autenticado**; operações são sempre do usuário logado.

### `POST /study-plans` — Criar plano

**Entrada (body)**

```json
{
  "groupId": "uuid",
  "title": "Plano ENEM 2026 - Matemática"
}
```

**Saída (`data`)** — `StudyPlanResponse`

```json
{
  "id": "uuid",
  "userId": "uuid",
  "groupId": "uuid",
  "title": "...",
  "createdAt": "..."
}
```

### `GET /study-plans` — Listar planos do usuário (paginado)

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `StudyPlanResponse`

### `GET /study-plans/:id` — Detalhe com itens e progresso

**Saída (`data`)** — `StudyPlanResponse`

```json
{
  "id": "uuid",
  "userId": "uuid",
  "groupId": "uuid",
  "title": "...",
  "createdAt": "...",
  "items": [
    {
      "id": "uuid",
      "studyPlanId": "uuid",
      "title": "Revisar equações",
      "description": "...",
      "estimatedHours": 4,
      "order": 0,
      "completed": false
    }
  ],
  "progress": {
    "totalItems": 10,
    "completedItems": 3,
    "totalEstimatedHours": 40,
    "completedEstimatedHours": 12,
    "completionPercent": 30
  }
}
```

### `PATCH /study-plans/:id` — Atualizar título

**Entrada (body)** — `{ "title": string }`

**Saída (`data`)** — `StudyPlanResponse`

### `DELETE /study-plans/:id` — Remover plano

**Saída (`data`)**

```json
{ "message": "Study plan deleted successfully" }
```

### `POST /study-plans/:id/items` — Adicionar item

**Entrada (body)**

```json
{
  "title": "Revisar equações do 2º grau",
  "description": "Resolver lista de exercícios.",
  "estimatedHours": 4
}
```

**Saída (`data`)** — `StudyPlanItemResponse`

### `POST /study-plans/items/:itemId/complete` — Marcar item concluído

**Saída (`data`)** — `StudyPlanItemResponse` (`completed: true`)

---

## Exams

### `POST /exams` — **Admin**

**Entrada (body)**

```json
{
  "groupId": "uuid",
  "title": "TJ-SP 2025",
  "institution": "TJ-SP",
  "organization": "Vunesp",
  "year": 2025,
  "roleName": "Escrevente Judiciário",
  "durationMinutes": 300,
  "questionIds": ["uuid", "uuid"]
}
```

**Saída (`data`)** — `ExamResponse` (com `sections`, `questionIds`, `totalQuestions`)

### `GET /exams` — **Autenticado** (paginado)

**Entrada (query)**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `groupId` | UUID | sim |
| `page` | int | não |
| `limit` | int | não |

**Saída (`data`)** — resposta paginada de `ExamResponse` (inclui `totalQuestions` por item)

```json
{
  "items": [
    {
      "id": "uuid",
      "groupId": "uuid",
      "title": "TJ-SP 2025",
      "institution": "TJ-SP",
      "organization": "Vunesp",
      "year": 2025,
      "roleName": "Escrevente Judiciário",
      "durationMinutes": 300,
      "totalQuestions": 50,
      "createdAt": "..."
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 20,
  "totalPages": 1
}
```

### `GET /exams/attempts/me` — **Autenticado** (paginado)

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `ExamAttemptResponse`

### `GET /exams/attempts/:attemptId` — **Autenticado**

**Saída (`data`)** — `ExamResultResponse`

```json
{
  "id": "uuid",
  "examId": "uuid",
  "userId": "uuid",
  "startedAt": "...",
  "finishedAt": "...",
  "score": 85.5,
  "totalCorrect": 42,
  "totalWrong": 8,
  "totalTimeSeconds": 10800,
  "totalQuestions": 50,
  "examTitle": "TJ-SP 2025",
  "institution": "TJ-SP",
  "year": 2025
}
```

### `GET /exams/:id` — **Autenticado**

**Saída (`data`)** — `ExamResponse` (detalhe completo)

### `GET /exams/:id/questions` — **Autenticado** (paginado)

Lista questões da prova para realização, com alternativas (sem gabarito) em uma única requisição paginada.

**Entrada (query)**

| Parâmetro | Tipo | Obrigatório |
|-----------|------|-------------|
| `page` | int | não |
| `limit` | int | não |
| `attemptId` | UUID | não (inclui respostas salvas da tentativa) |

**Saída (`data`)** — igual ao formato de `GET /simulations/:id/questions`, com campo extra `sectionId` por item quando a questão pertence a uma seção.

> Use este endpoint durante a realização da prova em vez de `GET /questions/:id` por questão.

### `PATCH /exams/:id` — **Admin**

**Entrada (body)** — opcionais: `title`, `institution`, `organization`, `year`, `roleName`, `durationMinutes`

**Saída (`data`)** — `ExamResponse`

### `DELETE /exams/:id` — **Admin**

**Saída (`data`)**

```json
{ "message": "Exam deleted successfully" }
```

### `POST /exams/:id/sections` — **Admin**

**Entrada (body)**

```json
{
  "name": "Conhecimentos Gerais",
  "weight": 1.5,
  "questionIds": ["uuid"]
}
```

**Saída (`data`)** — `ExamSectionResponse`

### `DELETE /exams/:id/sections/:sectionId` — **Admin**

**Saída (`data`)**

```json
{ "message": "Section deleted successfully" }
```

### `POST /exams/:id/start` — **Autenticado**

**Saída (`data`)**

```json
{
  "attempt": {
    "id": "uuid",
    "examId": "uuid",
    "userId": "uuid",
    "startedAt": "...",
    "finishedAt": null,
    "score": 0,
    "totalCorrect": 0,
    "totalWrong": 0,
    "totalTimeSeconds": 0,
    "totalQuestions": 50
  },
  "exam": {
    "title": "TJ-SP 2025",
    "institution": "TJ-SP",
    "year": 2025,
    "durationMinutes": 300
  }
}
```

### `POST /exams/attempts/:attemptId/answers` — **Autenticado**

**Entrada (body)** — igual ao simulado: `questionId`, `timeSpentSeconds` e `selectedAlternativeId` **ou** `textAnswer`

**Saída (`data`)**

```json
{ "isCorrect": true, "similarityScore": 0.85 }
```

### `POST /exams/attempts/:attemptId/finish` — **Autenticado**

**Entrada (body)**

```json
{
  "totalCorrect": 42,
  "totalWrong": 8,
  "totalTimeSeconds": 10800
}
```

**Saída (`data`)** — `ExamResultResponse`

---

## PDF Parser

Fluxo: **upload → process → preview → approve**.

### `POST /pdf-parser/exams/upload` — **Admin** (multipart)

**Entrada** — `multipart/form-data`

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| `file` | arquivo PDF | sim |

**Saída (`data`)** — `ImportJobResponse`

```json
{
  "id": "uuid",
  "uploadedBy": "uuid",
  "fileUrl": "/caminho/absoluto/uploads/pdf/...",
  "status": "pending",
  "type": "exam",
  "createdAt": "...",
  "errorMessage": null,
  "approvedRefId": null
}
```

### `POST /pdf-parser/exams/:jobId/process` — **Admin**

Executa OCR + parser heurístico.

**Saída (`data`)** — `ProcessExamPdfResponse`

```json
{
  "job": { "...ImportJobResponse, status: completed" },
  "validation": {
    "valid": true,
    "issues": []
  }
}
```

`validation.issues[]`: `{ "questionIndex": 0, "message": "..." }`

### `GET /pdf-parser/jobs/:jobId/preview` — **Autenticado** (dono do job)

**Saída (`data`)** — `ImportJobPreviewResponse`

```json
{
  "job": { "...ImportJobResponse" },
  "preview": {
    "kind": "exam",
    "questions": [
      {
        "statement": "...",
        "alternatives": [
          { "label": "A", "content": "...", "isCorrect": true }
        ],
        "discipline": "Direito",
        "topic": "Penal"
      }
    ],
    "validation": { "valid": true, "issues": [] }
  },
  "rawTextPreview": "trecho do texto OCR (max 2000 chars)..."
}
```

Preview de plano de estudo (`kind: "study_plan"`):

```json
{
  "kind": "study_plan",
  "plan": {
    "title": "Plano importado",
    "items": [
      { "title": "...", "description": "...", "estimatedHours": 4 }
    ]
  }
}
```

### `POST /pdf-parser/exams/:jobId/approve` — **Admin**

**Entrada (body)**

```json
{
  "title": "TJ-SP 2025",
  "groupId": "uuid",
  "institution": "TJ-SP",
  "organization": "Vunesp",
  "year": 2025,
  "roleName": "Escrevente Judiciário",
  "durationMinutes": 300
}
```

**Saída (`data`)**

```json
{
  "examId": "uuid",
  "questionIds": ["uuid", "uuid"]
}
```

### `POST /pdf-parser/study-plans/upload` — **Admin** (multipart)

Igual ao upload de prova; `type`: `study_plan`.

### `POST /pdf-parser/study-plans/:jobId/process` — **Admin**

**Saída (`data`)** — `ImportJobResponse` (`status: completed`)

### `POST /pdf-parser/study-plans/:jobId/approve` — **Admin**

**Entrada (body)**

```json
{
  "groupId": "uuid",
  "title": "Plano opcional"
}
```

| Campo | Obrigatório |
|-------|-------------|
| `groupId` | sim |
| `title` | não (usa título do PDF parseado) |

**Saída (`data`)**

```json
{ "studyPlanId": "uuid" }
```

### `GET /pdf-parser/jobs` — **Autenticado** (paginado)

Lista jobs de importação do usuário logado.

**Entrada (query)** — `page`, `limit` (opcionais)

**Saída (`data`)** — resposta paginada de `ImportJobResponse`

---

## Analytics

Agrega respostas de questões avulsas, simulados e provas.

### `GET /analytics/dashboard` — **Autenticado**

Dashboard do usuário logado.

**Entrada** — nenhuma (usa `userId` do JWT)

**Saída (`data`)**

```json
{
  "totalQuestions": 150,
  "totalCorrect": 105,
  "totalWrong": 45,
  "accuracy": 0.7,
  "averageTime": 42.5,
  "weakTopics": ["Direito Penal", "Processo Civil"],
  "strongTopics": ["Português"],
  "recommendations": [
    "Priorize revisão do tópico \"Direito Penal\" (acerto em 40% das 12 respostas).",
    "Faça simulados curtos diários para consolidar o conteúdo."
  ]
}
```

### `GET /analytics/groups/:groupId` — **Autenticado**

**Entrada (params)** — `groupId`: UUID

**Saída (`data`)**

```json
{
  "groupId": "uuid",
  "totalQuestions": 500,
  "totalAnswers": 1200,
  "totalCorrect": 840,
  "totalWrong": 360,
  "accuracy": 0.7,
  "averageTimeSeconds": 38.2,
  "topicBreakdown": [
    { "topic": "Penal", "totalQuestions": 80, "accuracy": 0.45 }
  ],
  "ranking": [
    {
      "userId": "uuid",
      "totalAnswers": 200,
      "accuracy": 0.85,
      "rank": 1
    }
  ],
  "recommendations": [
    "O grupo apresenta maior dificuldade em \"Penal\". Considere simulados temáticos."
  ]
}
```

> Ranking: mínimo 5 respostas por usuário; top 20 por acurácia.

### `GET /analytics/questions/:questionId` — **Admin**

**Saída (`data`)**

```json
{
  "totalAnswers": 320,
  "totalCorrect": 180,
  "totalWrong": 140,
  "averageTime": 65.3,
  "accuracy": 0.5625
}
```

---

## Crawlers — JurisWay

> Requer `JURISWAY_ENABLED=true` e `JURISWAY_GROUP_ID` no `.env`. Cron semanal: domingo 03:00.

### `POST /crawlers/jurisway/sync` — **Admin**

Sincroniza todas as matérias em `JURISWAY_MATERIAS`.

**Saída (`data`)**

```json
{
  "results": [
    {
      "materia": "Direito_Penal",
      "imported": 5,
      "skipped": 120,
      "failed": 0,
      "errors": []
    }
  ]
}
```

### `POST /crawlers/jurisway/sync/:materia` — **Admin**

Sincroniza uma matéria (ex.: `Direito_Penal`).

**Saída (`data`)** — mesmo objeto de um item em `results` acima.

---

## Status de importação (`ImportStatus`)

| Valor | Significado |
|-------|-------------|
| `pending` | PDF enviado, aguardando processamento |
| `processing` | OCR/parser em execução |
| `completed` | Pronto para preview/aprovação |
| `failed` | Erro (`errorMessage` no job) |

---

## Referência rápida — contagem de endpoints

| Módulo | Endpoints |
|--------|-----------|
| Auth | 1 |
| Users | 5 |
| Groups | 5 |
| Questions | 6 |
| Tags | 12 |
| Simulations | 9 |
| Flashcards | 7 |
| Study Plans | 7 |
| Exams | 13 |
| PDF Parser | 8 |
| Analytics | 3 |
| Crawlers (JurisWay) | 2 |
| **Total** | **78** |

---

*Documento gerado a partir dos controllers em `src/modules/*/presentation/controllers`. Para contratos interativos, use o Swagger em `/api/docs`.*
