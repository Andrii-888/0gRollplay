# 0G RollPlay — Changelog & Development Notes

## Project Overview

Decentralized poker platform built on 0G Network with MetaMask wallet integration, real-time multiplayer gameplay via Socket.IO, and Play-to-Earn mechanics.

---

## How to Run

### Frontend (React)

```bash
cd client
npm install
npm start
Frontend runs on: http://localhost:3000

Backend (Node.js + Socket.IO)
# From project root (0gRollplay/)
npm install
node server.js
Backend runs on: http://localhost:5001

Both at once
npm run dev
Note: Backend must be running for the game to work. Frontend connects to backend via WebSocket on port 5001.

v1.2.0 — Buy Credits, Error Handling, Game Menu
New Features
Buy Credits System

"Buy Credits" button in top-right corner of poker table
Modal with 4 chip packages: 1,000 / 5,000 / 10,000 / 50,000 chips
Real ETH transaction flow via MetaMask (sends to contract address)
Transaction status: pending → confirming → success / rejected / error
Clean error messages (insufficient funds, rejected, failed)
Chips balance display next to button
ETH wallet balance shown in modal
Auto-dismiss notifications after 4 seconds
Error Boundary

ErrorBoundary component wraps the Play page
Catches React render errors, prevents white screen
"Back to Menu" recovery button
Error logging to console for debugging
Game Selection Menu

POKER — active, navigates to wallet → game
BLACKJACK — Coming Soon (disabled)
ROULETTE — Coming Soon (disabled)
SLOTS — Coming Soon (disabled)
Transaction Notifications

Toast notifications for all transaction events
Color-coded: green (success), red (error), yellow (pending)
v1.1.0 — Frontend Cleanup & Wallet Integration
Bug Fixes
ESLint Warnings — 30+ fixes across 20 files

Removed unused variables and imports
Added missing alt attributes for accessibility
Fixed useEffect dependency arrays
Clean build with zero warnings
Critical Fixes

Fixed infinite loop crash (Maximum update depth exceeded) on Play.js
Fixed 404 route not working (added path="*")
Fixed GameState crash on table leave (null check + try-catch)
Fixed double-navigation crash in leaveTable()
Removed aggressive auto-redirect loop in ConnectWallet
New Features
MetaMask Wallet Integration

Custom useWallet hook with full lifecycle management
Connect / Disconnect MetaMask
Address + username persistence in localStorage
Auto-reconnect on page reload (passive eth_accounts check)
Account change detection (accountsChanged listener)
ETH balance fetching via ethers.providers.Web3Provider
Guest Mode

"Play as Guest" for users without MetaMask
Random wallet address generated
Both options shown if MetaMask installed
Username Validation

Required, 3-20 characters, alphanumeric + underscore
Real-time validation with green/red visual feedback
Character counter (0/20)
Enter key support
Video Splash Screen

Background video from CDN with blur overlay
"Enter Game" button with pulse animation
Flow: Video → Menu → Wallet → Poker
Routing

/ — Video splash screen
/menu — Game selection
/wallet — Username + MetaMask connection
/play — Poker table with Buy Credits
/* — 404 page
Security
.env removed from Git tracking (added to .gitignore)
API keys no longer exposed in repository
Architecture
User Flow:
  / (Video) → /menu (Games) → /wallet (Connect) → /play (Poker)

Key Files:
  hooks/useWallet.js          — MetaMask: connect, disconnect, buyChips, balance
  components/ErrorBoundary.js — React error boundary
  pages/ConnectWallet/        — Wallet connection + username page
  pages/Play.js               — Poker table + Buy Credits modal
  pages/MainPage.js           — Game selection menu
  components/loading/         — Video splash screen
  context/game/GameState.js   — Game logic: join, leave, fold, call, raise
  context/websocket/          — Socket.IO connection management
  socket/index.js             — Server-side game engine
  socket/packet.js            — Poker hand evaluation
What Can Be Added (Production Roadmap)
Blockchain Layer
 Deploy ERC20 token contract on testnet (Sepolia / 0G Testnet)
 Real token purchase flow (approve → transfer → mint chips)
 On-chain balance verification
 Transaction history page
 Withdraw chips → tokens
Game Features
 Blackjack game implementation
 Roulette game implementation
 Slots game implementation
 Tournament mode with prize pools
 Player chat in-game
 Sound effects for actions (deal, fold, win, chips)
 Hand history / replay
 Leaderboard and statistics
UX / Production
 Mobile responsive poker table
 Socket auto-reconnection with rejoin
 Loading skeleton states
 PWA support (offline mode)
 Multi-language support
 NFT avatars (placeholder ready)
Infrastructure
 MongoDB integration for user accounts
 JWT authentication (backend ready, middleware exists)
 Rate limiting and security headers (configured)
 Deployment to production (Vercel + Railway / VPS)
 CI/CD pipeline
Tech Stack
Layer	Technology
Frontend	React 16, Styled Components, SCSS
Backend	Node.js, Express
Real-time	Socket.IO 2.x
Blockchain	ethers.js v5 (client), v6 (server)
Wallet	MetaMask
Game Logic	pokersolver
Database	MongoDB (ready, currently disabled)
Files Changed (from original 0gcampaign/0gRollplay)
File	Status
client/src/hooks/useWallet.js	NEW — MetaMask hook
client/src/components/ErrorBoundary.js	NEW — Error boundary
client/src/pages/ConnectWallet/ConnectWallet.js	REWRITTEN — Full wallet UI
client/src/pages/ConnectWallet/ConnectWallet.scss	REWRITTEN — New styles
client/src/pages/Play.js	UPDATED — Buy Credits + modal
client/src/pages/MainPage.js	UPDATED — Game menu
client/src/components/routing/Routes.js	UPDATED — New routing
client/src/components/loading/LoadingScreen.js	UPDATED — Navigation
client/src/context/game/GameState.js	FIXED — Crash fixes
client/src/context/websocket/WebsocketProvider.js	FIXED — Warnings
CHANGELOG.md	NEW — This file
.gitignore	UPDATED — Added .env
+ 10 component files	FIXED — ESLint warnings
Repository
https://github.com/Andrii-888/0gRollplay



```
