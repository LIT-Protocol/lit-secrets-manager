"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LitNetwork } from "@lit-protocol/constants";

type NetworkContextType = {
  network: LitNetwork;
  setNetwork: (network: LitNetwork) => void;
};

type NetworkProviderProps = {
  children: ReactNode;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [network, setNetwork] = useState<LitNetwork>(LitNetwork.DatilDev);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}

export default NetworkContext;
