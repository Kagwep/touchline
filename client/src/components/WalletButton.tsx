import React, { useState } from 'react';
import { shortAddress } from '../utils/sanitizer';
import { Wallet, Copy, Check } from 'lucide-react';
import { Button } from './UI/button';
import { useDojo } from '../dojo/useDojo';
import { useTouchlineStore } from '../utils/touchline';
import { useNetworkAccount } from '../context/WalletContex';

const WalletButton = () => {
  const { account, address, status, isConnected } = useNetworkAccount();
  const { isWalletPanelOpen, setWalletPanelOpen } = useTouchlineStore((state) => state);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent wallet panel from opening
    
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setCopied(true);
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = account.address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    }
  };

  const handleButtonClick = () => {
    setWalletPanelOpen(!isWalletPanelOpen);
  };

  return (
    <div className="relative">
      <Button 
        className="p-2 flex gap-3 bg-green-800 hover:bg-green-700" 
        variant={"secondary"} 
        onClick={handleButtonClick}
      >
        <Wallet size={16} />
        <p className="font-vt323">
          {account?.address ? shortAddress(account?.address) : 'Connect'}
        </p>
        
        {/* Copy button - only show when connected */}
        {account?.address && (
          <button
            onClick={handleCopyAddress}
            className="ml-1 p-1 rounded hover:bg-green-600 transition-colors"
            title={copied ? "Copied!" : "Copy address"}
          >
            {copied ? (
              <Check size={12} className="text-green-300" />
            ) : (
              <Copy size={12} className="text-green-300" />
            )}
          </button>
        )}
      </Button>
      
      {copied && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">
          Address copied!
          {/* Arrow pointing up */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-green-600"></div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;