Потом вставьте весь текст ниже (Cmd+A → Cmd+V → Cmd+S):

# 0G RollPlay — Changelog & Development Notes

## Project Overview

Decentralized poker platform built on 0G Network with MetaMask wallet integration, real-time multiplayer gameplay via Socket.IO, and Play-to-Earn mechanics.

---

## v1.1.0 — Frontend Improvements & Wallet Integration

### Bug Fixes

**ESLint Warnings Cleanup**

- Removed ~15 unused variable declarations across game components
- Added missing `alt` attributes to all `<img>` elements for accessibility
- Fixed incorrect `useEffect` dependency arrays in 8 components
- Removed unused imports from Play.js, GameState.js, Seat.js, GameUI.js, WebsocketProvider.js, and others
- Result: clean build output with zero warnings

**Routing Fix**

- Fixed 404 page not catching unmatched routes (added `path="*"` to NotFoundPage route)
- Fixed infinite loop crash when Play.js was set as the root route without socket connection
- Added proper route structure: Splash → Wallet → Play

**GameState Crash Fix**

- Added null check for `currentTable` in seat turn detection
- Added try-catch to `SC_TABLE_LEFT` event handler
- Removed `navigate("/")` from `leaveTable()` to prevent double-navigation crash during unmount

### New Features

**MetaMask Wallet Connection**

- Implemented `useWallet` custom hook (`client/src/hooks/useWallet.js`)
  - Connect/disconnect MetaMask
  - Wallet address persistence via localStorage
  - Auto-reconnect on page reload (passive check, no popup)
  - Account change detection (listens to `accountsChanged` event)
  - Username persistence in localStorage
- Built wallet connection UI with glassmorphism design and gradient buttons

**Guest Mode**

- Users without MetaMask can enter the game as guests
- Random wallet address generated for guest sessions
- Adaptive UI: shows MetaMask button if available, guest-only otherwise

**Username Validation**

- Required, 3-20 characters, alphanumeric + underscore
- Real-time validation with visual feedback (green/red borders)
- Character counter and keyboard support (Enter to submit)

**Landing Page with Video**

- Activated video splash screen as app entry point
- Background video with frosted glass overlay
- Flow: Video Splash → Connect Wallet → Poker Table

### Security

- Removed `.env` from Git tracking

---

## Backlog

### High Priority

- [ ] End-to-end testing of full user flow
- [ ] Error boundary to prevent white screen crashes
- [ ] Socket disconnection handling with reconnect UI
- [ ] Integrate MainPage menu (Join Table, Quick Game, Shop, Rules)

### Medium Priority

- [ ] Mobile responsive improvements
- [ ] Loading states for socket connection
- [ ] Sound effects and player chat

### Future

- [ ] Additional games (Blackjack, Roulette, Slots)
- [ ] Tournament system
- [ ] NFT avatars and cross-chain support

---

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Frontend   | React 16, Styled Components, SCSS         |
| Backend    | Node.js, Express                          |
| Real-time  | Socket.IO                                 |
| Blockchain | ethers.js, MetaMask                       |
| Database   | MongoDB (disabled, game works without DB) |

---

## How to Run

    # Install dependencies
    npm install
    cd client && npm install && cd ..

    # Run both
    npm run dev
