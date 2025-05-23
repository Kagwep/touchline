import React from 'react';
import { Network } from "../utils/touchline";
import { Icon } from 'lucide-react';
import { soccerBall, soccerPitch } from '@lucide/lab';
import { Trophy, Award, Zap } from 'lucide-react';

interface NetworkSelectorProps {
  onNetworkSelected: (network: Network) => void;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({ onNetworkSelected }) => {
  // Handle server selection
  const handleServerSelect = (selectedNetwork: Network) => {
    onNetworkSelected(selectedNetwork);
  };

  const ServerBadge = ({ type, name }: { type: string, name: string }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-700/50 border border-green-500/30">
        <div className={`w-2 h-2 rounded-full animate-pulse ${
          type === "mainnet" ? "bg-emerald-500" : 
          type === "sepolia" ? "bg-blue-500" : "bg-amber-500"
        }`} />
        <span className="text-xs font-semibold uppercase tracking-wider text-green-100">
          {name}
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-green-800 to-green-700 flex flex-col items-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/stadium-blur.jpg')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-green-500/10 animate-pulse">
        <Trophy size={80} />
      </div>
      <div className="absolute bottom-20 right-10 text-green-500/10 animate-pulse" style={{animationDelay: "1.5s"}}>
        <Award size={70} />
      </div>
      <div className="absolute top-40 right-40 text-green-500/10 animate-pulse" style={{animationDelay: "0.8s"}}>
        <Zap size={60} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 py-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <Icon iconNode={soccerBall} className="w-10 h-10 text-green-300" />
          <h1 className="text-5xl sm:text-6xl font-bold text-green-300">
            TOUCHLINE
          </h1>
        </div>
        <h2 className="text-xl text-green-100 font-medium tracking-wide flex items-center">
          <Icon iconNode={soccerPitch} className="w-5 h-5 mr-2" />
          SELECT YOUR LEAGUE NETWORK
        </h2>

        <div className={`grid grid-cols-1 ${
            import.meta.env.VITE_SEPOLIA === 'false' 
              ? 'md:grid-cols-3' 
              : 'md:grid-cols-2'
          } gap-6 w-full mt-8`}>
          {/* Mainnet Card */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-green-800/70 to-green-900/70 border border-green-500/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-900/20 group">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="mainnet" name="MAINET" />
                <Trophy className="w-8 h-8 text-yellow-400/70" />
              </div>
              <p className="text-green-100/90 text-lg">
                Join the elite competition. Play with real stakes and compete against the world's best managers.
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <button
                  disabled
                  onClick={() => handleServerSelect("mainnet")}
                  className="mt-auto w-full py-4 bg-green-600 text-white font-medium tracking-wider 
                  border border-green-500/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-500 hover:border-green-400/50
                  active:scale-95 group-hover:bg-green-500"
                >
                  CONNECT
                </button>
                <p className="text-xs text-green-300/70 text-center">Official tournaments available</p>
              </div>
            </div>
          </div>

          {/* Sepolia Card */}
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-green-800/70 to-green-900/70 border border-green-500/30 backdrop-blur-sm
            transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-900/20 group">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="sepolia" name="CONNECT" />
                <Award className="w-8 h-8 text-blue-400/70" />
              </div>
              <p className="text-green-100/90 text-lg">
                Competitive gameplay with no real-world stakes. Perfect for serious managers in training.
              </p>
              <button
                onClick={() => handleServerSelect("sepolia")}
                className="mt-auto w-full py-4 bg-green-600 text-white font-medium tracking-wider 
                  border border-green-500/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-500 hover:border-green-400/50
                  active:scale-95 group-hover:bg-green-500"
              >
                CONNECT
              </button>
            </div>
          </div>

          {/* Testnet Card */}
          {import.meta.env.VITE_SEPOLIA === 'false' && (
          <div className="flex flex-col rounded-xl overflow-hidden bg-gradient-to-br from-green-800/70 to-green-900/70 border border-green-500/30 backdrop-blur-sm
          transition-all duration-300 hover:border-green-400/50 hover:shadow-lg hover:shadow-green-900/20 group">
            <div className="p-6 flex flex-col gap-6 h-full">
              <div className="flex justify-between items-start">
                <ServerBadge type="testnet" name="KATANA" />
                <Icon iconNode={soccerBall} className="w-8 h-8 text-amber-400/70" />
              </div>
              <p className="text-green-100/90 text-lg">
                Practice your tactics and management skills in a risk-free environment.
              </p>
              <button
                onClick={() => handleServerSelect("katana")}
                className="mt-auto w-full py-4 bg-green-600 text-white font-medium tracking-wider 
                  border border-green-500/50 rounded-lg shadow-lg shadow-green-900/20
                  transition-all duration-300 hover:bg-green-500 hover:border-green-400/50
                  active:scale-95 group-hover:bg-green-500"
              >
                CONNECT
              </button>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkSelector;