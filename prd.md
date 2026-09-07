# PRD — CoSync (Real-Time Collaborative Code Editor & Whiteboard)

## 1. Vision
A web app where multiple users can join a shared "room" and edit the same document (code file or freeform whiteboard) simultaneously, seeing each other's changes and cursors live — like a self-built, minimal Google Docs / Figma for code and sketches.

## 2. Problem Statement
Most student full-stack projects are single-user CRUD apps. They don't demonstrate any understanding of concurrency, state synchronization, or distributed systems — the exact things backend/infra interviews probe. This project exists to produce real, defensible answers to "tell me about a hard technical problem you solved."

## 3. Target Users (for the demo narrative)
- Small dev teams doing pair programming remotely
- Students collaborating on assignments
- Interview panels doing live coding rounds
(You won't actually acquire these users — but the app should be believable enough that it could be pitched to them.)

## 4. Core Features (MVP)
| # | Feature | Notes |
|---|---------|-------|
| 1 | Create/join a room via shareable link | No auth required for MVP |
| 2 | Live text editing synced across all clients in a room | This is the core hard problem |
| 3 | Presence indicators | Show who's in the room, colored cursors/selections |
| 4 | Conflict-free merging of concurrent edits | CRDT-based (see architecture.md) |
| 5 | Persistence | Document state saved so a room survives server restarts / users rejoining |
| 6 | Basic syntax highlighting | Use CodeMirror/Monaco, not custom |

## 5. Stretch Features (post-MVP, in priority order)
1. Whiteboard mode (freeform shapes/lines) alongside code mode, same CRDT infra
2. User accounts + saved room history
3. Horizontal scaling: multiple backend instances synced via Redis pub/sub (this is the "impress a senior engineer" feature)
4. Voice chat or comments/annotations
5. Version history / time-travel (rewind to earlier document state)
6. Access control (view-only vs edit links)

## 6. Explicitly Out of Scope
- No AI/ML features (by design — this project is meant to prove systems/backend skill, not API-calling)
- No mobile app — responsive web is enough
- No enterprise auth (SSO, SAML) — a JWT-based simple auth is enough if you get to accounts

## 7. Success Criteria (for your resume/demo, not real metrics)
- Two browser tabs/two devices editing the same doc with visibly instant sync and no lost keystrokes under normal typing speed
- Can explain, whiteboard-style, in an interview: why CRDT over OT, how conflicts are resolved, how it'd scale past one server
- Deployed and publicly accessible with a live demo link in your resume

## 8. Key Risks
- CRDT libraries (Yjs) have a learning curve — budget real time for this, don't underestimate
- Redis pub/sub for multi-instance sync is the most "impressive" feature but also most likely to get cut if time runs short — treat it as stretch, not MVP
- Scope creep into whiteboard mode before the editor is solid — resist this
