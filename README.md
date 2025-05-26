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
1. Launch Touchline and connect your cartrige controller
2. Start collecting cards and building your squad!

## 🎯 How to Play

### 1. **Collect Cards**
- Acquire player cards through marketplace
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

