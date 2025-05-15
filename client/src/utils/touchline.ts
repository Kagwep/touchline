import { create } from 'zustand';
import GameState from './gamestate';



export type ScreenPage =
  | "start"
  | "play"
  | "market"
  | "inventory"
  | "beast"
  | "leaderboard"
  | "upgrade"
  | "profile"
  | "encounters"
  | "guide"
  | "settings"
  | "player"
  | "wallet"
  | "tutorial"
  | "onboarding"
  | "create adventurer"
  | "future";

interface State {
  onboarded: boolean;
  handleOnboarded: () => void;
  handleOffboarded: () => void;
  game_id: number | undefined;
  set_game_id: (game_id: number) => void;
  match_id: number | undefined;
  set_match_id: (match_id: number) => void;
  squad_id: number | undefined;
  set_squad_id: (squad_id: number) => void;
  game_state: GameState;
  set_game_state: (game_state: GameState) => void;
  current_source: number | null;
  set_current_source: (source: number | null) => void;
  current_target: number | null;
  set_current_target: (target: number | null) => void;
  isContinentMode: boolean;
  setContinentMode: (mode: boolean) => void;
  highlighted_region: number | null;
  setHighlightedRegion: (region: number | null) => void;
//   battleReport: Battle | null;
//   setBattleReport: (report: Battle | null) => void;
  player_name: string;
  setPlayerName: (name: string) => void;
  lastDefendResult: Event | null;
  setLastDefendResult: (result: Event | null) => void;
//   lastBattleResult: Battle | null;
//   setLastBattleResult: (battle: Battle | null) => void;
  tilesConqueredThisTurn: number[];
  setTilesConqueredThisTurn: (tile: number[]) => void;
  round_limit: number;
  setRoundLimit: (limit: number) => void;
  username: string;
  setUsername: (value: string) => void;
  isWalletPanelOpen: boolean;
  setWalletPanelOpen: (isOpen: boolean) => void;
  network: Network;
  setNetwork: (value: Network) => void;
  onMainnet: boolean;
  onSepolia: boolean;
  onKatana: boolean;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
  loginScreen: boolean;
  dojoConfig: any;
  setDojoConfig: (value: any) => void;
  setLoginScreen: (value: boolean) => void;
  screen: ScreenPage;
  setScreen: (value: ScreenPage) => void;
}

export const useTouchlineStore = create<State>((set) => ({

  game_id: -1,
  set_game_id: (game_id: number) => {
    set(() => ({ game_id }));
  },
  match_id: -1,
  set_match_id: (match_id: number) => {
    set(() => ({ match_id }));
  },
    squad_id: -1,
  set_squad_id: (squad_id: number) => {
    set(() => ({ squad_id }));
  },
  game_state: GameState.MainMenu,
  set_game_state: (game_state: GameState) => set(() => ({ game_state })),
  current_source: null,
  set_current_source: (source: number | null) => set(() => ({ current_source: source })),
  current_target: null,
  set_current_target: (target: number | null) => set(() => ({ current_target: target })),
  isContinentMode: false,
  setContinentMode: (mode: boolean) => set(() => ({ isContinentMode: mode })),
  highlighted_region: null,
  setHighlightedRegion: (region: number | null) => set(() => ({ highlighted_region: region })),
//   battleReport: null,
//   setBattleReport: (report: Battle | null) => set(() => ({ battleReport: report })),
  player_name: '',
  setPlayerName: (name: string) => set(() => ({ player_name: name })),
  onboarded: false,
  handleOnboarded: () => {
    set({ onboarded: true });
  },
  handleOffboarded: () => {
    set({ onboarded: false });
  },
  lastDefendResult: null,
  setLastDefendResult: (result: Event | null) => set(() => ({ lastDefendResult: result })),
//   lastBattleResult: null,
//   setLastBattleResult: (battle: Battle | null) => set(() => ({ lastBattleResult: battle })),
  username: "",
  setUsername: (value) => set({ username: value }),
  tilesConqueredThisTurn: [],
  setTilesConqueredThisTurn: (tile: number[]) => set(() => ({ tilesConqueredThisTurn: tile })),
  round_limit: 15,
  setRoundLimit: (limit: number) => set(() => ({ round_limit: limit })),
  isWalletPanelOpen: false,
  setWalletPanelOpen: (isOpen: boolean) => set(() => ({ isWalletPanelOpen: isOpen })),
  network: undefined,
  setNetwork: (value) => {
    set({ network: value });
    set({ onMainnet: value === "mainnet" });
    set({ onSepolia: value === "sepolia" });
    set({ onKatana: value === "katana" || value === "localKatana" });
  },
  onMainnet: false,
  onSepolia: false,
  onKatana: false,
  isMuted: false,
  setIsMuted: (value) => set({ isMuted: value }),
  loginScreen: false,
  dojoConfig: undefined,
  setDojoConfig: (value) => {
    set({ dojoConfig: value });
  },
  setLoginScreen: (value) => set({ loginScreen: value }),
  screen: "start",
  setScreen: (value) => set({ screen: value }),
}));


export type Network =
  | "mainnet"
  | "katana"
  | "sepolia"
  | "localKatana"
  | undefined;






  export const tutorialContent = [
    {
        gType: 'section',
        data: {
            title: 'Welcome to Touchline Soccer',
            content: 'Learn how to collect, manage and play with your football cards in this comprehensive guide.'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/touchline_intro.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Wallet Connection',
            content: 'Before starting gameplay, you need to connect your wallet to access all features and store your player cards and in-game assets.'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/wallet_connect.PNG',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Connecting Your Wallet',
            content: 'Follow these steps to connect your wallet:\n\n1. Click the "Verify Club Ownership" button in the top-right corner\n2. Confirm the connection request in your wallet\n3. Once connected, your wallet address will appear in the header as your Manager ID'
        }
    },
    {
        gType: 'video',
        data: {
            url: 'https://res.cloudinary.com/dydj8hnhz/video/upload/v1745601573/pjmbbkndbs26amb3uzmy.mp4',
            title: 'Wallet Connection Tutorial',
            width: '560px',
            height: '315px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Club Manager Integration',
            content: 'The Club Manager interface allows you to manage your player cards and connect your wallet seamlessly:'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/club_manager.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Using the Club Manager',
            content: 'The Club Manager provides these wallet functions:\n\n• Card Collection: View and organize your player cards\n• Token Balance: Check your transfer budget\n• Transaction History: Review past transfers\n• Disconnect: Safely disconnect your wallet when finished'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Wallet Security',
            content: 'Important security tips:\n\n• Never share your wallet seed phrase\n• Always verify transaction details before signing\n• Disconnect your wallet when not playing\n• Use a dedicated gaming wallet separate from your main holdings'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Basic Controls',
            content: 'Your manager panel contains several important buttons: Team Selection (bottom), Training and Boost (center), and a Tactics guide (top). Each serves a crucial function in managing your squad.'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/manager_panel.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Team Selection',
            content: 'The large green circle at the bottom is your Team Selection button. Click it to place new players in your starting lineup. This is your primary way of building your squad.'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Player Management',
            content: 'In the center panel, you have two key abilities:\n\n• Training (♥): Select a player and press Training to improve their fitness\n• Boost (⚡): Increases player energy for special moves\n\nRemember: Every match consumes energy, so manage your resources wisely!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Help & Information',
            content: 'The "i" button at the top right will open this guide anytime you need to review the controls. Use it to refresh your memory about game mechanics and player management.'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/player_actions.png',
            width: '400px',
            height: '100px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'NFT Card Integration',
            content: 'With your wallet connected, you can:\n\n• Import NFT player cards from your wallet collection\n• Deploy rare player cards with special abilities\n• Earn new player cards through match achievements\n• Trade cards with other managers on the transfer market'
        }
    },
    {
        gType: 'video',
        data: {
            url: 'https://www.youtube.com/embed/nft_player_cards',
            title: 'NFT Player Card Tutorial',
            width: '560px',
            height: '315px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Player Positions',
            content: 'Players can be assigned different positions:\n\n• Attack: Strikers and Forwards focused on scoring\n• Midfield: Central players who connect defense and attack\n• Defense: Players who protect your goal\n• Goalkeeper: Last line of defense'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Formation Selection',
            content: 'To set your formation:\n1. Select "Formations" tab\n2. Browse available formations (4-3-3, 4-4-2, etc.)\n3. Click to select your preferred formation\n\nIMPORTANT: Each formation has strengths and weaknesses. Match your formation to your playing style and opponent tactics.'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/formation_screen.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Club Badges',
            content: ''
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/player_info.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Player Information Display',
            content: 'Click on any player card to view its detailed information. The info panes show crucial stats about your selected player:'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Player Stats',
            content: '• Fitness: Current player fitness level\n• Energy: Available energy for matches\n• Shooting: Goal scoring ability\n• Passing: Ball distribution accuracy\n• Defending: Tackle and interception ability\n• Card ID: Unique identifier\n• Manager: Owner of the card\n• Position: Current player position (ST/MF/DF/GK)'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Live Updates',
            content: 'The information panes update in real-time as you select different player cards or when player stats change during matches. Keep an eye on fitness levels - they affect your player\'s performance!'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/manager_bar.png',
            width: '1200px',
            height: '40px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Manager Information',
            content: 'The top bar shows your manager status. From left to right:\n\n• Manager Name\n• Home Club (with badge)\n• Manager Level\n• Trophies Count\n• Available Boosts\n• Points\n• Available Tactics\n• Match Status Button'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Wallet Balance Display',
            content: 'Next to your manager info, you\'ll see your wallet status including:\n\n• Connected wallet address (abbreviated)\n• Transfer budget balance\n• Special item count\n'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Tactics System',
            content: 'Tactics are your action points for team control:\n\n• Start with 8 tactics in your first match half\n• Renewed to 3 tactics in subsequent halves\n• Each tactic type (Press/Counter/Possession/Defensive) can only be used once before switching\n• Plan your actions carefully - tactics are precious resources!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Match Management',
            content: 'The End Half button indicates your match status:\n\n• Green: It\'s your turn to make tactical decisions\n• Red: Opponent\'s turn - plan your next moves\n\nStrategic Tip: Always monitor your players\' fitness and energy levels when planning tactics. Efficient tactical usage is key to victory!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Match Mechanics',
            content: 'Player positions affect performance:\n\n• Attack Bonuses:\n  - Striker position: +10 shooting\n  - Inside Forward: +15 shooting (highest)\n  - Winger position: +5 shooting\n\n• Defense Bonuses:\n  - Center Back position: +15 defense (highest)\n  - Full Back position: +5 defense\n  - Defensive Midfielder: +10 defense'
        }
    },
    {
        gType: 'image',
        data: {
            url: '/images/match_play.png',
            width: '400px',
            height: '225px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Transfer Market Integration',
            content: 'Access the in-game transfer market through your Club Manager to:\n\n• Purchase premium player cards with connected wallet\n• Sell unwanted cards for tokens\n• Trade cards with other managers\n• View current market trends and player values'
        }
    },
    {
        gType: 'video',
        data: {
            url: 'https://www.youtube.com/embed/transfer_market_tutorial',
            title: 'Transfer Market & Trading Tutorial',
            width: '560px',
            height: '315px'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Victory Conditions',
            content: 'Win the match by achieving either:\n\n• Score more goals than your opponent\n• Dominate possession and shots on target for points victory\n\nStrategize your approach based on your squad strengths!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Points & Tactics',
            content: 'Points earned vary by tactical approach:\n\nHighest Reward Actions:\n• Goals from counterattacks: 40 points\n• Set piece goals: 35 points\n• Open play goals: 30 points\n\nBonus Points For:\n• Clean sheets: 40 points\n• Possession dominance: 30 points\n• Shots on target: 25 points\n\nTip: Counter-attacking offers the highest risk/reward ratio!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Manager Levels & Progression',
            content: 'Earn points to progress through manager levels:\n\n• Amateur → Semi-Pro → Professional → Elite\n• Master → Legend → Hall of Fame\n\nEarn points through match wins and tournament success!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Boost System',
            content: 'Boost resource management:\n\n• Earn boost by:\n  - Winning matches\n  - Tournament progress\n\n• Spend boost on:\n  - Training players (20 boost)\n  - Boosting player energy (20 boost)\n\nStrategic tip: Save boosts for critical matches in tournaments!'
        }
    },
    {
        gType: 'section',
        data: {
            title: 'Wallet Rewards',
            content: 'Earn blockchain rewards directly to your connected wallet:\n• Rare player card NFTs for completing achievements\n• Season rewards for consistent participation\n• Special event rewards during tournaments'
        }
    }
];



export const getElementStoreState = () => {
    return useTouchlineStore.getState();
  };