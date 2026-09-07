# TRD — Technical Requirements Document — CoSync

## 1. Purpose
This document defines the technical architecture, components, and non-functional requirements for CoSync — a real-time collaborative code editor/whiteboard. It complements `prd.md` (what to build) with how to build it.

## 2. System Components

```
┌─────────────┐        WebSocket        ┌──────────────────┐
│   Client A   │◄──────────────────────►│                  │
│ (React + CRDT│                        │  WS Gateway Node  │
│  doc replica)│                        │   (Node/Go)       │
└─────────────┘                        │                  │
                                        │   - Auth check    │
┌─────────────┐        WebSocket        │   - Room routing  │
│   Client B   │◄──────────────────────►│   - Broadcast     │
└─────────────┘                        └────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │   Redis Pub/Sub    │
                                        │ (cross-instance    │
                                        │  message relay)    │
                                        └─────────┬─────────┘
                                                  │
                                        ┌─────────▼─────────┐
                                        │   Postgres          │
                                        │ (room metadata,     │
                                        │  periodic snapshots)│
                                        └─────────────────────┘
```

## 3. Conflict Resolution: CRDT over OT
- OT needs central-server-maintained transform ordering — correctness is notoriously hard to get right (took Google years for Docs/Wave).
- CRDTs let each client apply local edits immediately; replicas merge deterministically with no central coordinator needed for correctness.
- Use **Yjs** (mature JS CRDT library) rather than a from-scratch implementation — writing your own CRDT is a research-scale project, not a resume-scale one. You must still understand the merge semantics deeply enough to defend the choice in an interview.

## 4. Data Flow — Single Edit Propagation
1. User types in Client A (editor bound to a Yjs `Y.Doc`).
2. Yjs emits a binary update representing the delta.
3. Client A sends the update over its WebSocket to its connected gateway instance.
4. That gateway: (a) publishes to Redis channel `room:<roomId>`, (b) broadcasts to its own locally-connected clients.
5. Other gateway instances subscribed to that channel receive and broadcast to their local clients.
6. Every client applies the update to its local Yjs doc; CRDT merge guarantees convergence regardless of arrival order.
7. Periodically, the current doc state is serialized and snapshotted to Postgres.

## 5. Why Redis Pub/Sub
A single process holds a finite set of WebSocket connections. Once you run more than one backend instance, two clients in the same room may land on different instances. Redis pub/sub fans a message out from "whichever instance received it" to "every instance serving that room." This is the standout, interview-defensible piece of the system.

## 6. Backend Language
- **Node.js** (`ws` or Socket.io): fastest path to MVP, same-language ecosystem as Yjs.
- **Go**: stronger "I write performant systems" story; Yjs's Go port (`y-go`) is less mature — higher risk.
- Recommendation: build in Node first; cite Go as the scale-up rewrite plan in interviews.

## 7. Non-Functional Requirements
| Requirement | Target |
|---|---|
| Edit propagation latency | < 200ms same-region |
| Reconnect recovery | Client resyncs full state within 2s of reconnect |
| Concurrent clients per room | 10+ without visible lag (MVP target) |
| Data durability | No committed edit lost on server restart (via snapshotting) |
| Horizontal scalability | Adding a backend instance requires no code change, only Redis subscription |

## 8. Frontend Technical Notes
- Editor: CodeMirror 6 with `y-codemirror.next` binding (better CRDT support than Monaco currently).
- Presence/cursors: Yjs Awareness protocol — built-in, don't hand-roll.
- Whiteboard (stretch): canvas layer backed by a shared `Y.Array` of shape objects.

## 9. Scaling Notes (interview talking points even if not fully implemented)
- WebSocket connections are stateful — horizontal scaling needs sticky sessions or connection-aware routing at the load balancer.
- Redis itself would need clustering at real scale.
- Per-client rate limiting on incoming updates prevents a misbehaving client from flooding a room.
