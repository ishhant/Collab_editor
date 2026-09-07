# Schema — CoSync (Postgres)

## 1. `rooms`
| Column | Type | Notes |
|---|---|---|
| id | text (PK) | short URL-safe ID, e.g. nanoid |
| name | text | optional display name |
| room_type | text | `code` \| `whiteboard` |
| owner_id | uuid (FK -> users.id, nullable) | null for MVP (no auth) |
| created_at | timestamptz | default now() |
| last_active_at | timestamptz | updated on any activity, used for cleanup jobs |

## 2. `snapshots`
| Column | Type | Notes |
|---|---|---|
| id | bigserial (PK) | |
| room_id | text (FK -> rooms.id) | indexed |
| doc_state | bytea | binary-encoded Yjs document state |
| created_at | timestamptz | default now() |

Only the latest snapshot per room is needed for basic hydration; keep older ones only if you build the stretch "version history" feature. Index on `(room_id, created_at desc)` for fast latest-snapshot lookup.

## 3. `users` (stretch — only if auth is added)
| Column | Type | Notes |
|---|---|---|
| id | uuid (PK) | |
| email | text (unique) | |
| password_hash | text | if not using an OAuth provider |
| display_name | text | |
| created_at | timestamptz | |

## 4. `room_members` (stretch — only if auth + "My Rooms" is added)
| Column | Type | Notes |
|---|---|---|
| room_id | text (FK -> rooms.id) | |
| user_id | uuid (FK -> users.id) | |
| role | text | `owner` \| `editor` \| `viewer` |
| joined_at | timestamptz | |

Composite primary key on `(room_id, user_id)`.

## 5. Notes on Design Choices
- `doc_state` as `bytea` rather than trying to model document content relationally — Yjs state is a binary CRDT structure, not naturally tabular. Don't fight this; store it as an opaque blob and let Yjs encode/decode it.
- No per-keystroke audit table in MVP — snapshot-based persistence is enough. Add an `updates` log table only if you build the stretch time-travel/version-history feature, and even then, prefer periodic compaction over storing every single update forever.
- `last_active_at` on `rooms` supports a simple cleanup job (e.g. delete snapshots for rooms inactive > 90 days) — a small but real "I thought about data lifecycle" detail worth mentioning in interviews.
