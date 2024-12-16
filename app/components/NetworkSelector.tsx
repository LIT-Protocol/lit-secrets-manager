"use client";

import React from "react";
import { useNetwork } from "../contexts/NetworkContext";

// Using string literals for network values as required by LitNodeClient
const NETWORKS = {
  DATIL_DEV: "datil-dev",
  DATIL_TEST: "datil-test",
  DATIL: "datil",
} as const;

type NetworkType = (typeof NETWORKS)[keyof typeof NETWORKS];

export const NetworkSelector = () => {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value as NetworkType;
    setNetwork(newNetwork);
  };

  return (
    <div className="bg-orange-600 px-6 py-2 flex items-center">
      <label htmlFor="network-select" className="text-white mr-2 text-sm">
        Lit Network
      </label>
      <select
        id="network-select"
        value={network}
        onChange={handleNetworkChange}
        className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm"
      >
        <option value={NETWORKS.DATIL_DEV}>Datil Dev</option>
        <option value={NETWORKS.DATIL_TEST}>Datil Test</option>
        <option value={NETWORKS.DATIL}>Datil</option>
      </select>
    </div>
  );
};

export default NetworkSelector;
