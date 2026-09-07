# Rules — CoSync


## 1. Git Workflow
- `main` branch is always deployable.
- One feature branch per item in `phases.md`, e.g. `feature/ws-gateway`, `feature/yjs-integration`.
- Commit messages: `type: short description` — types are `feat`, `fix`, `refactor`, `docs`, `chore`. Example: `feat: add redis pub/sub relay for cross-instance sync`.
- Squash-merge feature branches into `main` with a clean summary commit — your commit history is part of what a recruiter/interviewer may skim.

## 2. Code Structure
- Monorepo layout:
  ```
  /client       (React app)
  /server       (WS gateway + REST API)
  /shared       (types shared between client/server, if using TypeScript)
  /docs         (these markdown files)
  ```
- Use TypeScript on both client and server — type safety matters more here than usual because CRDT update payloads are binary/structured and easy to misuse.

## 3. Testing Requirements
- Every CRDT merge/conflict scenario you can think of gets a test: two simultaneous edits to the same line, edit + delete race, offline client rejoining and syncing.
- WS gateway: at least one integration test simulating two connected clients and asserting both converge to the same document state.
- Don't aim for 100% coverage — aim for coverage of the *hard* logic (sync/merge), not trivial CRUD.

## 4. Environment & Config
- All secrets (Redis URL, Postgres connection string, JWT secret if added) in `.env`, never committed. Provide `.env.example`.
- Local dev: docker-compose spinning up Redis + Postgres so setup is one command (`docker-compose up`). This alone is a small but real "I understand dev environments" signal.

## 5. Code Review Rules (self-review checklist, since you're solo)
- Does this change handle the "two clients edit at once" case, or does it assume single-user timing?
- Did I add/update a test for any new sync logic?
- Would I be comfortable walking an interviewer through this file line by line?

## 6. Documentation Discipline
- Update `memory.md` at the end of every work session — what got done, what's blocked, what's next. Future-you (and Claude, if you use it to keep coding) needs this more than you think.
- Update `phases.md` checkboxes as phases complete — don't let it silently go stale.

## 7. Deployment
- Frontend: Vercel/Netlify (static React build).
- Backend: Render/Railway/Fly.io (supports long-lived WebSocket connections — confirm this before picking a host, some serverless platforms don't).
- Postgres + Redis: managed free tiers (Supabase/Neon for Postgres, Upstash for Redis) to avoid infra babysitting.
