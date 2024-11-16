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
     // await generateSession();
    } catch (err) {
      setError("Failed to encrypt: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSession = async () => {
    try {
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
      
      const sessionSigs = await litNodeClient.getSessionSigs({
        chain: "baseSepolia",
        expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
        resourceAbilityRequests: [
          {
            resource: new LitAccessControlConditionResource(
              await LitAccessControlConditionResource.generateResourceString(
                accessControlConditions,
                dataToEncryptHash
              )
            ),
            ability: LitAbility.AccessControlConditionDecryption,
          },
        ],
        authNeededCallback: async ({
          uri,
          expiration,
          resourceAbilityRequests,
        }) => {
          const toSign = await createSiweMessage({
            uri,
            expiration,
            resources: resourceAbilityRequests,
            walletAddress: ethersWallet.address,
            nonce: await litNodeClient.getLatestBlockhash(),
            litNodeClient,
          });

          return await generateAuthSig({
            signer: ethersWallet,
            toSign,
          });
        },
      });

      const decryptionResult = await decryptToString(
        {
          chain: "baseSepolia",
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
          sessionSigs,
        },
        litNodeClient
      );

      setDecryptedText(decryptionResult);
    } catch (err) {
      setError("Failed to generate session: " + err.message);
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
          "670a52293d0c9dbfcf02637d46edc6d6508e00a8218540347c68d093235c7cd5",
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
      <div className="font-medium mb-2">{title}:</div>
      <div className="relative bg-gray-100 text-gray-900 p-4 rounded-lg break-all">
        <div className="pr-10">{content}</div>
        <button
          onClick={() => copyToClipboard(content, label)}
          className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded"
          title={`Copy ${label}`}
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Encrypt Secrets</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter text to encrypt..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => encryptKey(inputText)}
          disabled={!inputText || isLoading}
          className={`w-full mt-2 px-4 py-2 text-white rounded ${
            !inputText || isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isLoading ? "Processing..." : "Encrypt Secret"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {copyStatus && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {copyStatus}
        </div>
      )}

      {ciphertext && (
        <div>
          <ResultBox 
      
            title="Encrypted " 
            content={ciphertext} 
            label="encryptedKey"
          />
          
          <ResultBox 
            title="Data Hash" 
            content={dataToEncryptHash} 
            label="data hash"
          />

          
        </div>
      )}
    </div>
  );
}