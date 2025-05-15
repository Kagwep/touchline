import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useUiSounds, soundSelector } from "../hooks/useUiSound";
import { useTouchlineStore } from "../utils/touchline";
import { useNetwork } from "../context/NetworkContext";

interface IntroProps {
  onOnboardComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onOnboardComplete }) => {
  const {
    setLoginScreen,
    setScreen,
    handleOnboarded,
    setIsMuted,
    isMuted,
  } = useTouchlineStore();
  const { network } = useNetwork(); // Get the already selected network
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { account, status } = useAccount();
  const cartridgeConnector = connectors[0];
  const { play: clickPlay } = useUiSounds(soundSelector.bg);

  // Handle continue button click
  const handleContinue = () => {
    // For mainnet/sepolia, check wallet connection
    if ((network === "mainnet" || network === "sepolia") && status !== "connected") {
      // Attempt to connect wallet
      connect({ connector: cartridgeConnector });
    } else {
      // For testnet or already connected wallets, proceed
      setScreen("start");
      handleOnboarded();
      onOnboardComplete();
      if (network !== "katana") {
        setLoginScreen(true);
      }
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-green-900 to-green-700">
      {/* Sound toggle button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {
            if (!isMuted) {
              //clickPlay(); // Only play sound if not muted
            }
            toggleSound();
          }}
          className="p-2 rounded-full bg-green-800/50 border border-green-500/30 
                   text-green-300 hover:bg-green-700/50 hover:border-green-400/30"
        >
          {isMuted ? (
            <span className="text-xl">🔇</span>
          ) : (
            <span className="text-xl">🔊</span>
          )}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-green-300 tracking-[0.2em] font-mono">
          TOUCHLINE SOCCER
        </h1>
        
        <div className="w-full max-w-2xl bg-green-800/50 border border-green-500/30 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-mono text-green-300 mb-4">MANAGER BRIEFING</h2>
          <p className="text-green-100/90 mb-4">
            Welcome, Coach. You've been appointed as the new manager of your football club. 
            Your mission is to build the ultimate team through tactical card collecting and skillful gameplay.
          </p>
          <p className="text-green-100/90 mb-6">
            The stadium is packed and the fans are waiting. The beautiful game awaits your strategy.
          </p>
          
          <div className="w-full bg-green-900/50 rounded-lg p-2 mb-6">
            <div className="flex items-center justify-center">
              <img 
                src="/touch.png" 
                alt="Football Stadium" 
                className="rounded border border-green-500/30 max-w-full"
              />
            </div>
            <p className="text-xs text-center text-green-300/70 mt-2 font-mono">
              TACTICAL OVERVIEW: TOUCHLINE STADIUM
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-700/50 border border-green-500/30">
                <div className={`w-2 h-2 rounded-full ${
                  network === "mainnet" ? "bg-emerald-500" : 
                  network === "sepolia" ? "bg-blue-500" : "bg-amber-500"
                }`} />
                <span className="text-xs font-mono uppercase tracking-wider text-green-300">
                  {network === "mainnet" ? "CHAMPIONS LEAGUE" : 
                   network === "sepolia" ? "PREMIER DIVISION" : "TRAINING GROUNDS"}
                </span>
              </div>
              
              {(network === "mainnet" || network === "sepolia") && (
                <div className={`px-2 py-1 rounded-full text-xs font-mono ${
                  status === "connected" ? "bg-green-700/50 text-green-300" : "bg-green-900/50 text-gray-300"
                }`}>
                  {status === "connected" ? "CLUB VERIFIED" : "CLUB VERIFICATION NEEDED"}
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={handleContinue}
            className="w-full py-4 bg-green-600 text-green-100 font-mono tracking-wider 
                  border border-green-500/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-500 hover:border-green-400/50
                  active:scale-95"
          >
            {(network === "mainnet" || network === "sepolia") && status !== "connected" 
              ? "Connect" 
              : "ENTER THE STADIUM"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;