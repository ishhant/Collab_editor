# App Flow — CoSync

## 1. New User — Create a Room
1. User lands on homepage.
2. Clicks "New Room" — no signup required for MVP.
3. Backend generates a unique room ID (short, URL-safe, unguessable — e.g. nanoid).
4. Postgres row created in `rooms` table.
5. User is redirected to `/room/:roomId`, WebSocket connection opens, empty Yjs doc initialized.
6. UI shows a "Share this link" prompt with the room URL.

## 2. Second User — Join a Room
1. User opens the shared room link.
2. Frontend checks room exists (REST call or WS handshake failure if not).
3. WebSocket connection opens; server sends the current Yjs doc state (from memory if room is active, or hydrated from latest Postgres snapshot if this is the first connection since a restart).
4. Client applies the received state to its local `Y.Doc`.
5. Awareness protocol broadcasts this user's presence (name/color) to existing participants — their cursor/avatar appears for others.

## 3. Live Editing Session
1. User A types — local Yjs doc updates instantly (optimistic, no wait for server).
2. Update is sent to server, relayed (via Redis if multi-instance) to all other connected clients in the room.
3. User B's client receives the update, merges it into their local Yjs doc — cursor position and unedited text preserved even if User B was mid-edit elsewhere in the doc.
4. Presence layer updates cursor positions in near-real-time as users move their selection.

## 4. Disconnect / Reconnect Flow
1. User's network drops or tab is backgrounded — WebSocket closes.
2. Client shows a "Reconnecting..." indicator, attempts exponential-backoff reconnect.
3. On reconnect, client re-sends its local Yjs state vector; server responds with only the updates the client is missing (Yjs supports diffing via state vectors — avoids re-sending the whole doc).
4. Client merges the diff; UI indicator clears.

## 5. Room Goes Idle / Empty
1. Last user leaves the room (WebSocket closes, no other clients connected).
2. Server triggers a final snapshot write to Postgres.
3. In-memory doc state for that room can be evicted after a grace period (e.g. 5 minutes) to free memory on the gateway instance.
4. Room remains joinable later — next joiner triggers hydration from the snapshot (see Flow 2, step 3).

## 6. (Stretch) Authenticated User Flow
1. User signs up/logs in (JWT-based).
2. "My Rooms" view lists rooms they've created or joined, backed by a `room_members` join table.
3. Room creation now associates `owner_id`; optional room visibility setting (public link vs invite-only).

## 7. (Stretch) Whiteboard Mode Flow
1. On room creation, user selects room type: "Code" or "Whiteboard."
2. Whiteboard room binds a canvas component to a shared `Y.Array` of shape objects instead of a text-based `Y.Text`.
3. Same join/sync/reconnect flows apply — only the rendered surface and the Yjs data type differ.
