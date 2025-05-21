// GlobalContext.tsx
"use client";

import React, { createContext, useContext, useState,type ReactNode } from 'react';
import { AccountInterface } from 'starknet';

interface GlobalContextType {
  account: AccountInterface | undefined;
  address: string | null;
  selectedRoute: string | null;
  chainId: bigint | undefined;
  setAccount: (account: AccountInterface | undefined) => void;
  setAddress: (address: string | null) => void;
  setChainId: (chainId: bigint | undefined) => void;
  setSelectedRoute:(selectedRoute: string | null) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<AccountInterface | undefined>();
  const [address, setAddress] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null); // 'app' or 'bridge'
  const [chainId, setChainId] = useState<bigint | undefined>(undefined);

  return (
    <GlobalContext.Provider value={{ account, address,selectedRoute,chainId, setAccount, setAddress , setSelectedRoute,setChainId}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};