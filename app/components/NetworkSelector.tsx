"use client";

import React from 'react';
import { LitNetwork } from "@lit-protocol/constants";
import { useNetwork } from '../contexts/NetworkContext';

export const NetworkSelector = () => {
  const { network, setNetwork } = useNetwork();

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value as LitNetwork;
    setNetwork(newNetwork);
    // Dispatch custom event for components that need to reinitialize
    window.dispatchEvent(new CustomEvent('networkChange'));
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
        <option value={LitNetwork.DatilDev}>Datil Dev</option>
        <option value={LitNetwork.DatilTest}>Datil Test</option>
        <option value={LitNetwork.Datil}>Datil</option>
      </select>
    </div>
  );
};

export default NetworkSelector;
