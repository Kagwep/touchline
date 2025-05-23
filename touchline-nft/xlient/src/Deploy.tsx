import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './provider/GlobalContext';
import { useSendTransaction } from '@starknet-react/core';
import { FACTORY_ABI, FactoryAddress, provider } from './constants';
import { parseInputAmountToUint256 } from './utils';
import toast from 'react-hot-toast';
import { StarknetkitConnectButton } from './provider/StarknetkitProvider';
import { Contract } from "starknet";

// Define types for contract interactions
type DeployAndMintResult = {
  contractAddress: string;
  tokenId: string;
};



// Placeholder for actual Starknet contract interface
// In a real implementation, you would use starknet.js or similar library


const StarknetNFTInterface: React.FC = () => {
  const [recipient, setRecipient] = useState<string>('');
  const [nftCount, setNftCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DeployAndMintResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { account,chainId } = useGlobalContext();

    const { sendAsync } = useSendTransaction({
    calls: undefined
  });

  // Fetch NFT count on component mount
  useEffect(() => {
    fetchNFTCount();
  }, []);

  useEffect(() => {
  if (account && account.address) {
    setRecipient(account.address);
  }
}, [account]);

  const contract = new Contract(FACTORY_ABI, FactoryAddress, provider);

  const mockTouchlineNFTFactory = {
  deployAndMint: async (recipient: string): Promise<DeployAndMintResult> => {
    // Generate token ID at deployment time
    const tokenId = Date.now().toString();
    console.log(`Deploying and minting tokenId ${tokenId} to ${recipient}`);
    // Simulate contract call delay
    try{
    const calls = [
        {
          contractAddress: FactoryAddress,
          entrypoint: "deploy_and_mint",
          calldata: [
            recipient,
            parseInputAmountToUint256(tokenId).low,
            parseInputAmountToUint256(tokenId).high
          ]
        }
      ]

    await sendAsync(calls);
    toast.success("Card card deployed")
    }catch(error){
        toast.error(`something went wrong ${error}`)
    }

    return {
      contractAddress: '0x' + Math.random().toString(16).substring(2, 42),
      tokenId
    };
  },
  getNFTCount: async (): Promise<number> => {
    const result = await contract.get_nft_count();
    return result;
  }
};



  const fetchNFTCount = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const count = await mockTouchlineNFTFactory.getNFTCount();
      setNftCount(count);
      setError(null);
    } catch (err) {
      setError(`Error fetching NFT count: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeployAndMint = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    
    if (!recipient) {
      setError('Recipient address is required');
      return;
    }

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setResult(null);
      setError(null);
      
      const { contractAddress, tokenId } = 
        await mockTouchlineNFTFactory.deployAndMint(recipient);
      
      setResult({
        contractAddress,
        tokenId
      });
      
      // Refresh NFT count after minting
      await fetchNFTCount();
    } catch (err) {
      setError(`Error during deploy and mint: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 border-2 border-green-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-green-700">Touchline NFT Factory</h1>
          
          {/* Wallet Connection Button */}
          {account ? (
            <div className="p-2 text-white bg-green-600 rounded-lg ">
                {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
            </div>
          ) : (
            <StarknetkitConnectButton />
          )}
        </div>
        
        {/* Wallet Status Display */}
        {account && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-sm font-medium text-green-800 mb-1">Wallet Connected</h3>
            <p className="text-xs text-green-700">
              <span className="font-medium">Address:</span> {account.address}
            </p>
            <p className="text-xs text-green-700">
              <span className="font-medium">Chain ID:</span> {chainId?.toString()}
            </p>
          </div>
        )}
        
        {/* NFT Count Display */}
        <div className="mb-6 p-4 bg-green-50 rounded-md border border-green-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-green-700">Total  NFTs</h2>
            <button 
              onClick={fetchNFTCount}
              className="px-2 py-1 bg-green-200 hover:bg-green-300 rounded text-sm text-green-800"
              disabled={isLoading}
            >
              ↻ Refresh
            </button>
          </div>
          <div className="mt-2">
            {isLoading && nftCount === null ? (
              <p className="text-green-500">Loading...</p>
            ) : (
              <p className="text-3xl font-bold text-green-600">{nftCount}</p>
            )}
          </div>
        </div>
        
        {/* Deploy and Mint Form */}
        <div className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium text-green-700 mb-1">
              Recipient Address
            </label>
            <input
            id="recipient"
            type="text"
            value={recipient || (account && account.address) || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
            <p>
              <span className="font-medium">Note:</span> Token ID will be automatically generated at deployment time using the current timestamp.
            </p>
          </div>
          
            <button
            onClick={handleDeployAndMint}
            disabled={!account || isLoading}
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm disabled:bg-green-400 disabled:cursor-not-allowed"
            >
            {!account ? 'Connect Wallet to Continue' : isLoading ? 'Processing...' : 'Deploy and Mint NFT'}
            </button>
        </div>
        
        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="font-medium text-green-800">Successfully Deployed and Minted!</h3>
            <div className="mt-2 text-sm text-green-700">
              <p><span className="font-medium">Contract Address:</span> {result.contractAddress}</p>
              <p><span className="font-medium">Token ID:</span> {result.tokenId}</p>
            </div>
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default StarknetNFTInterface;