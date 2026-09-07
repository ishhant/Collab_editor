# Implementation Plan — CoSync

Estimated for part-time work alongside coursework. Keep the order — each phase depends on the previous one actually working, not just existing.

## Phase 0 — Setup (2–3 days)
- [ ] Repo scaffolded: `/client`, `/server`, `/shared`, `/docs`; TypeScript on both ends
- [ ] docker-compose running Redis + Postgres locally
- [ ] React app renders a CodeMirror instance (no sync yet, single user)

## Phase 1 — Naive Real-Time Sync, No Conflict Handling (1 week)
- [ ] WebSocket connection from client to server on room join
- [ ] Full document text sent per keystroke, broadcast to all clients in room, last-write-wins
- [ ] Goal: two tabs, typing in one shows up in the other within ~1s. Simultaneous typing will visibly break — expected, motivates Phase 2.

## Phase 2 — CRDT Integration (1.5–2 weeks)
- [ ] Replace naive sync with Yjs (`Y.Doc` + `y-codemirror.next` binding)
- [ ] Client sends/receives Yjs binary updates instead of full text
- [ ] Verify: simultaneous typing in different parts of the doc never loses keystrokes or corrupts state
- [ ] Add Yjs Awareness for cursor position + user color/name

## Phase 3 — Persistence (1 week)
- [ ] Implement `rooms` and `snapshots` tables per `schema.md`
- [ ] Hydrate from latest snapshot on room join if one exists
- [ ] Periodic snapshot job (interval or on last-user-leaves)

## Phase 4 — Multi-Instance Scaling via Redis (1–1.5 weeks)
- [ ] Run two backend instances locally on different ports
- [ ] Redis pub/sub channel per room relays updates between instances
- [ ] Manually verify cross-instance sync: Client A on instance 1, Client B on instance 2
- [ ] This is the headline interview feature — prioritize it over later polish phases

## Phase 5 — Auth & Room Management (3–5 days, stretch)
- [ ] JWT-based auth, or skip entirely and rely on unguessable room IDs if time is short
- [ ] `users` and `room_members` tables per `schema.md`
- [ ] "My Rooms" view

## Phase 6 — Whiteboard Mode (stretch, 1–2 weeks)
- [ ] Canvas-based shape/line drawing bound to a shared `Y.Array`
- [ ] Room-type toggle between code editor and whiteboard

## Phase 7 — Polish & Deployment (1 week)
- [ ] Deploy frontend (Vercel/Netlify), backend (Render/Fly.io — confirm WebSocket support), managed Redis (Upstash) + Postgres (Supabase/Neon)
- [ ] Landing page copy (doubles as portfolio piece)
- [ ] 60–90s demo video showing two-tab live sync — link this in your resume, not just the repo
- [ ] README condensed from these docs

## Priority If Time-Constrained
Non-negotiable MVP: Phases 0–3. Phase 4 (Redis multi-instance) is what separates this from a typical student project — cut Phase 6 (whiteboard) before cutting Phase 4.
