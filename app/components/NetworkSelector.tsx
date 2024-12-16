import React, { useState } from 'react';
import { LitNetwork } from "@lit-protocol/constants";

export const NetworkSelector = () => {
  const [network, setNetwork] = useState(
    typeof window !== 'undefined'
      ? localStorage.getItem('selectedNetwork') || LitNetwork.DatilDev
      : LitNetwork.DatilDev
  );

  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newNetwork = e.target.value;
    setNetwork(newNetwork);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedNetwork', newNetwork);
      window.location.reload(); // Reload to reinitialize LitNodeClient
    }
  };

  return (
    <div className="bg-orange-600 px-6 py-2">
      <select
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
