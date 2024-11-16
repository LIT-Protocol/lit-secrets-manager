"use client"
import React, { useState } from 'react'
import { useEffect } from 'react';
import { LitNodeClient, encryptString, decryptToString } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitActionResource,
  LitPKPResource,
  LitAccessControlConditionResource
} from "@lit-protocol/auth-helpers";
import { Copy } from "lucide-react";

export default function Secrets() {
  const [ethersWallet, setEthersWallet] = useState();
  const [litNodeClient, setLitNodeClient] = useState();
  const [ciphertext, setCiphertext] = useState();
  const [dataToEncryptHash, setDataToEncryptHash] = useState();
  const [inputText, setInputText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [litActionCid, setLitActionCid] = useState("");

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(`Copied ${label}!`);
      setTimeout(() => setCopyStatus(""), 2000);
    } catch (err) {
      setError(`Failed to copy ${label} to clipboard`);
    }
  };

  const encryptKey = async (dataToEncrypt) => {
    try {
      setIsLoading(true);
      setError("");
      
      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "baseSepolia",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: ethersWallet.address,
          },
        },
      ];

      const { ciphertext, dataToEncryptHash } = await encryptString(
        {
          accessControlConditions,
          dataToEncrypt,
        },
        litNodeClient
      );
      
      setCiphertext(ciphertext);
      setDataToEncryptHash(dataToEncryptHash);
    } catch (err) {
      setError("Failed to encrypt: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const litNodeClient = new LitNodeClient({
          litNetwork: LitNetwork.DatilDev,
          debug: false
        });
        await litNodeClient.connect();
        
        const ethersWallet = new ethers.Wallet(
          "Eth private key",
          new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );

        setEthersWallet(ethersWallet);
        setLitNodeClient(litNodeClient);
      } catch (err) {
        setError("Failed to initialize: " + err.message);
      }
    };

    init();
  }, []);

  const ResultBox = ({ title, content, label }) => (
    <div className="mb-4">
      <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
      <div className="relative bg-orange-50 p-4 rounded-lg break-all border border-orange-200">
        <div className="pr-10 font-mono text-gray-900">{content}</div>
        <button
          onClick={() => copyToClipboard(content, label)}
          className="absolute top-2 right-2 p-2 hover:bg-orange-100 rounded"
          title={`Copy ${label}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-orange-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Encrypt Secrets</h1>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lit Action CID
            </label>
            <input
              type="text"
              placeholder="Enter Lit Action CID..."
              value={litActionCid}
              onChange={(e) => setLitActionCid(e.target.value)}
              className="w-full p-3 border border-orange-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Secret to Encrypt
            </label>
            <textarea
              placeholder="Enter text to encrypt..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 border border-orange-200 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
              rows="3"
            />
          </div>

          <button
            onClick={() => encryptKey(inputText)}
            disabled={!inputText || isLoading}
            className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded transition-colors duration-200 font-medium ${
              !inputText || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Encrypt Secret"
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {copyStatus && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {copyStatus}
            </div>
          )}

          {ciphertext && (
            <div className="space-y-4">
              <ResultBox 
                title="Encrypted Data" 
                content={ciphertext} 
                label="encrypted data"
              />
              
              <ResultBox 
                title="Data Hash" 
                content={dataToEncryptHash} 
                label="data hash"
              />

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Object:</h3>
                <div className="font-mono text-sm text-gray-900 break-all">
                  {JSON.stringify({ 
                    encryptedData: ciphertext, 
                    dataToEncryptHash: dataToEncryptHash 
                  }, null, 2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}