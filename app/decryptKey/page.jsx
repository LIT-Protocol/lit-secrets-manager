"use client";
import React, { useState, useEffect } from "react";
import { LitNodeClient, decryptToString } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import * as ethers from "ethers";
import axios from "axios";

import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitAccessControlConditionResource,
} from "@lit-protocol/auth-helpers";

function DcryptKey() {
  const [ciphertext, setCiphertext] = useState("");
  const [dataToEncryptHash, setDataToEncryptHash] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [ethersWallet, setEthersWallet] = useState();
  const [litNodeClient, setLitNodeClient] = useState();

  const getDecryptedKey = async () => {
    const accessControlConditions = [
      {
        contractAddress: "",
        standardContractType: "",
        chain: "baseSepolia",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: ethersWallet.address, // Address of the wallet that can decrypt the data
        },
      },
    ];

    const sessionSigs = await litNodeClient.getSessionSigs({
      chain: "baseSepolia",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
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

    console.log("Decrypted key is:", decryptionResult);
    setApiKey(decryptionResult); // Set decrypted result as API key
  };

  const callOpenAI = async () => {
    const url = "https://api.openai.com/v1/chat/completions"; 
    const data = {
      model: "gpt-4o", 
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Tell me a joke." },
      ],
      max_tokens: 100,
      temperature: 0.7,
    };

    try {
        console.log("Using API Key:", apiKey);

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const litNodeClient = new LitNodeClient({
          litNetwork: LitNetwork.DatilDev,
          debug: false,
        });
        await litNodeClient.connect();

        const ethersWallet = new ethers.Wallet(
          "670a52293d0c9dbfcf02637d46edc6d6508e00a8218540347c68d093235c7cd5",
          new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
        );

        setEthersWallet(ethersWallet);
        setLitNodeClient(litNodeClient);
      } catch (err) {
        console.error("Failed to initialize:", err.message);
      }
    };

    init();
  }, []);

  return (
    <div>
      <h1>Decrypt Key</h1>
      <div>
        <label>
          Ciphertext:
          <input
            type="text"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            placeholder="Enter ciphertext"
          />
        </label>
      </div>
      <div>
        <label>
          Data to Encrypt Hash:
          <input
            type="text"
            value={dataToEncryptHash}
            onChange={(e) => setDataToEncryptHash(e.target.value)}
            placeholder="Enter data to encrypt hash"
          />
        </label>
      </div>
      <button
        onClick={async () => {
          await getDecryptedKey();
          await callOpenAI();
        }}
      >
        Decrypt & Call OpenAI
      </button>
    </div>
  );
}

export default DcryptKey;
