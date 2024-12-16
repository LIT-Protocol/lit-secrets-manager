"use client";

import React, { useState, useEffect } from 'react';
import { LitNetwork } from "@lit-protocol/constants";

export const NetworkSelector = () => {
  const [network, setNetwork] = useState(LitNetwork.DatilDev);

  useEffect(() => {
    // Initialize network from localStorage on mount
    const storedNetwork = localStorage.getItem('selectedNetwork');
    if (storedNetwork && Object.values(LitNetwork).includes(storedNetwork as LitNetwork)) {
      setNetwork(storedNetwork as LitNetwork);
    }
  }, []);

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value as LitNetwork;
    setNetwork(newNetwork);
    localStorage.setItem('selectedNetwork', newNetwork);
    window.location.reload();
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
