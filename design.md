# Design — CoSync

## 1. Design Principles
- The product being demoed is the *sync*, not the visual polish — keep the UI clean and out of the way so the live-collaboration behavior is what stands out in a demo.
- Every screen should make multi-user presence obvious at a glance (colored cursors, avatar stack) — this is the "wow" moment interviewers/viewers should notice first.

## 2. Screens

### 2.1 Landing Page
- Product name + one-line pitch ("Real-time collaborative code editor — like Google Docs for code").
- Single primary CTA: "Create a Room" (no signup wall for MVP).
- Small "How it works" section — 3 short steps (create, share link, edit together).

### 2.2 Room / Editor View
- Top bar: room name/ID, "Copy invite link" button, stack of avatars/initials for connected users (colored per user).
- Main area: CodeMirror editor, full height, minimal chrome.
- Each remote user's cursor rendered as a thin colored line with a small name tag that fades after a few seconds of inactivity.
- Connection status indicator (small dot: green = synced, yellow = reconnecting).

### 2.3 Whiteboard View (stretch)
- Same top bar as editor view for consistency.
- Canvas fills main area; minimal toolbar (pen, rectangle, text, color picker) docked left or bottom.
- Remote users' active tool/cursor shown as a colored dot with name label.

### 2.4 "My Rooms" (stretch, if auth added)
- Simple list/table: room name, last active, participant count, "Open" button.

## 3. Visual System
- Keep it minimal — dark-mode-first (developer-tool aesthetic fits the product), a single accent color for primary actions.
- User colors: assign each participant a color from a fixed palette (6–8 distinct, accessible hues) deterministically by join order or user ID hash — avoid random collisions where two users get near-identical colors.
- Typography: monospace font for the editor (obviously), a clean sans-serif (e.g. Inter) for UI chrome.

## 4. Key UX Details Worth Getting Right
- **Instant local feedback**: never block a user's own typing waiting on network round-trip — this is the CRDT's whole point, and it should be visibly true in the demo.
- **Graceful reconnect UI**: don't just freeze — show the reconnecting state so it's clear the app is handling network blips, not broken.
- **Cursor labels that don't obstruct text**: fade/shrink name tags after ~2s of cursor inactivity so multiple users' labels don't clutter the view.

## 5. Out of Scope for Design
- No onboarding tutorial/walkthrough needed for MVP — the product should be self-explanatory within 10 seconds.
- No mobile-optimized layout required — this is a desktop-first tool, a responsive-but-not-mobile-tuned layout is enough.
