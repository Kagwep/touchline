"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import { type StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";
import { useGlobalContext } from "./GlobalContext";


interface StarknetkitProviderProps {
  children: ReactNode;
}

const StarknetkitContext = createContext({ openModal: () => {} });

export const StarknetkitProvider = ({ children }: StarknetkitProviderProps) => {
  const { connectAsync, connectors} = useConnect();
  
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as unknown as StarknetkitConnector[],
    modalTheme: "dark",
  });

  const openModal = async () => {
    const { connector } = await starknetkitConnectModal();
    if (!connector) {
      // Handle the case where no connector is selected
      return;
    }
    await connectAsync({ connector });
  };

  const { setAccount, setAddress,setChainId } = useGlobalContext(); // Access global context
  const { account, address,chainId } = useAccount(); // Get account and address from useAccount

  // Update global context whenever account or address changes
  React.useEffect(() => {
    setAccount(account);
    console.log(account)
    setAddress(address as string);
    setChainId(chainId);
  }, [account, address, setAccount, setAddress]);


  return (
    <StarknetkitContext.Provider value={{ openModal }}>
      {children}
    </StarknetkitContext.Provider>
  );
};

export const useStarknetkit = () => {
  return useContext(StarknetkitContext);
};

// Example usage of the button within the provider
export const StarknetkitConnectButton = () => {
  const { openModal } = useStarknetkit();

  return (
    <button
      className=" justify-center text-white bg-blue-500 bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md  transition"
      onClick={openModal}
    >
      Connect Wallet
    </button>
  );
};
