"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Using string literals for network values as required by LitNodeClient
const NETWORKS = {
  DATIL_DEV: "datil-dev",
  DATIL_TEST: "datil-test",
  DATIL: "datil",
} as const;

type NetworkType = (typeof NETWORKS)[keyof typeof NETWORKS];

type NetworkContextType = {
  network: NetworkType;
  setNetwork: (network: NetworkType) => void;
};

type NetworkProviderProps = {
  children: ReactNode;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [network, setNetwork] = useState<NetworkType>(NETWORKS.DATIL_DEV);

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>{children}</NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}

export default NetworkContext;
