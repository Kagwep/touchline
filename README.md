# ⚽ Touchline

**The Ultimate Digital Football Card Game on StarkNet**

Touchline is a fully  ochain-based football card game built on Dojo that combines the thrill of collecting digital player cards with strategic squad building and competitive gameplay. Built on StarkNet using the Dojo framework, Touchline offers true ownership of your digital assets and transparent, provably fair gameplay.

## 🎮 Game Overview

Touchline brings the excitement of football card collecting. Players collect digital cards of real football players, build strategic squads, and compete in matches using a unique commit-reveal gameplay mechanism that ensures fair play and strategic depth.

## ✨ Key Features

### 🃏 **Digital Card Collection**
- **Player Cards**: Collect cards featuring real football players with authentic stats
- **Rarity System**: Common, Rare, Epic, Legendary, and Icon tier cards
- **Position-Based Gameplay**: Goalkeeper, Defender, Midfielder, and Forward positions
- **Dynamic Stats**: Attack, Defense, and Special ability ratings
- **Special Abilities**: Unique player abilities that can turn the tide of matches

### 🏟️ **Squad Management**
- **Multiple Formations**: 4-4-2, 4-3-3, 3-5-2, 5-3-2, and 3-4-3 tactical setups
- **Chemistry System**: Build synergy between players for enhanced performance
- **Squad Builder**: Create and manage multiple squads with different strategies
- **Player Substitutions**: Make tactical changes during matches

### ⚔️ **Strategic Combat System**
- **Commit-Reveal Mechanism**: Submit encrypted moves, then reveal for fair gameplay
- **Turn-Based Strategy**: Plan your moves carefully in each round
- **Action Types**: Attack, Defend, Special abilities, and Substitutions
- **Tactic Cards**: Special cards that provide strategic advantages

### 🏆 **Competitive Features**
- **Match Creation**: Create and join matches with other players
- **Real-Time Competition**: Compete against opponents worldwide
- **Tournament System**: *(Coming Soon)* Organized competitions with rewards
- **Leaderboards**: Track your performance and climb the rankings

## 🛠️ Technical Architecture

Touchline is built using cutting-edge blockchain technology:

- **StarkNet**: Layer 2 scaling solution for Ethereum
- **Dojo Framework**: Cairo-based game engine for on-chain games
- **Cairo Language**: Smart contracts written in Cairo for optimal performance
- **React + TypeScript**: Modern frontend with type safety
- **Tailwind CSS**: Utility-first CSS framework for responsive design

## 🏗️ Smart Contract Systems

### Core Systems
- **Players System**: Create and manage player cards with stats and abilities
- **Squad System**: Build and organize your teams with formations
- **Match System**: Handle match creation, joining, and progression
- **Actions System**: Process in-game moves and reveals

### Data Models
- **Card**: Player information, stats, position, rarity
- **Squad**: Team composition, formation, chemistry
- **Match**: Game state, participants, rounds
- **Special Abilities**: Unique player skills and bonuses

## 🚀 Getting Started

### 🎮 **Play Now**
- **Main Game**: [touchline-eight.vercel.app](https://touchline-eight.vercel.app/)
- **NFT Cards**: [touchline-wn3c.vercel.app](https://touchline-wn3c.vercel.app/)

### Prerequisites
- Node.js 18+ and Yarn
- Cartridge controller
- Basic understanding of Web3 gaming

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/touchline.git
cd touchline

# Install dependencies
cd client
yarn install

# Set up environment variables
cp .env.example .env.local
# Set for local development:
VITE_SEPOLIA=false
VITE_MAINNET=false

# Start the development server
yarn dev
```

### Connecting Your Wallet

1. Install a StarkNet-compatible wallet (ArgentX recommended)
2. Connect to the StarkNet testnet
3. Launch Touchline and connect your wallet
4. Start collecting cards and building your squad!

## 🎯 How to Play

### 1. **Collect Cards**
- Acquire player cards through packs or trading
- Each card has unique stats and abilities
- Rarer cards have higher stats and special powers

### 2. **Build Your Squad**
- Create squads with up to 23 players
- Choose formations that match your strategy
- Optimize chemistry between players

### 3. **Compete in Matches**
- Create matches or join existing ones
- Use the commit-reveal system for fair play
- Make strategic decisions each turn

### 4. **Master the Meta**
- Learn player synergies and optimal formations
- Time your special abilities and substitutions
- Adapt your strategy based on opponents

## 🔮 Upcoming Features

### 🏆 **Tournaments** *(Coming Soon)*
- Weekly and seasonal competitions
- Exclusive rewards and titles
- Skill-based matchmaking
- Community-driven events

### 👥 **Community Hub** *(Coming Soon)*
- Player-to-player trading
- Guild system for team play
- Global chat and social features
- Collection showcases

### 📱 **Mobile Experience**
- Native mobile app
- Cross-platform progression
- Touch-optimized gameplay

## 🤝 Contributing

We welcome contributions from the community! Whether you're a developer, designer, or football enthusiast, there are ways to get involved:

- **Developers**: Submit PRs for bug fixes and features
- **Designers**: Help improve UI/UX and card designs  
- **Community**: Provide feedback, report bugs, and suggest features
- **Content**: Help with documentation and guides

### Development Setup

```bash
# Install Dojo CLI (Sozo)
curl -L https://install.dojoengine.org | bash
dojoup

# Navigate to contracts directory
cd touchline/contracts/touchline

# Build contracts
sozo build

# Make sure Katana is running in separate terminal
katana --dev

# Deploy contracts
sozo migrate

# Run Torii indexer (in another terminal)
torii --world <WORLD_ADDRESS> --database-url sqlite://indexer.db

# Navigate to client and start frontend
cd ../../client
yarn install
yarn dev
```

**Environment Configuration for Local Development:**
```bash
# In client/.env.local
VITE_SEPOLIA=false
VITE_MAINNET=false
```

## 📜 Smart Contract Addresses

### StarkNet Testnet
- **World Contract**: `0x5c03d111ab397c124a1533be0ec9f4857e8743f6bd7da2f083afc7bd30518c5`
- **Actions System**: `0x3c05bc4562d839d904a4207d785d3c9a8ee6ded2d458c32616b743b4a2d4056`
- **Players System**: `0x4b8a12ddf7ce5bd0d7a0b44d80ac586d1cfd1a6d58602f41d32ad17de7a3bff`
- **Squad System**: `0x4b53410fdf210ad919dbf5f62d8f4b0cc80be440908840012e48d48fd69427f`
- **Match System**: `0x2c58807b35829eeffd62f5dec6c6e86999abf4cba2f27ade99df8d177d6d5fa`

## 🛡️ Security & Fair Play

- **Commit-Reveal Protocol**: Prevents move prediction and ensures fair gameplay
- **On-Chain Verification**: All game logic is transparent and verifiable
- **Audited Contracts**: Smart contracts undergo security reviews
- **Anti-Cheat Measures**: Blockchain-based validation prevents manipulation

## 📊 Game Economy

- **True Ownership**: Players own their cards as NFTs
- **Player Trading**: Direct peer-to-peer card exchanges *(Coming Soon)*
- **Seasonal Content**: Regular card releases and meta updates
- **Reward System**: Earn cards and tokens through gameplay

## 🌐 Community & Support

- **🎮 Play Game**: [touchline-eight.vercel.app](https://touchline-eight.vercel.app/)
- **🃏 NFT Cards**: [touchline-wn3c.vercel.app](https://touchline-wn3c.vercel.app/)
- **Discord**: Join our community for real-time chat and support
- **Twitter**: Follow [@TouchlineGame](https://twitter.com/TouchlineGame) for updates
- **GitHub**: Contribute to the project and report issues
- **Documentation**: Comprehensive guides and API docs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

