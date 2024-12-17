export function generateExampleCode(secretObject) {
  return `// Example code for using your encrypted secret
const { encryptedData, dataToEncryptHash, accessControlConditions, litNetwork, ipfsCid } = ${JSON.stringify(secretObject, null, 2)};

// Initialize Lit client
const client = new LitNodeClient({ litNetwork });
await client.connect();

// Auth your user by getting session sigs.  This is setup to use metamask as the signer in a browser, but you can use any signer.
// Docs on doing this on the server side are here: https://developer.litprotocol.com/sdk/access-control/quick-start#obtain-asessionsigson-the-server-side
const sessionSigs = await this.litNodeClient.getSessionSigs({
  chain: "ethereum",
  resourceAbilityRequests: [
    {
      resource: new LitActionResource("*"),
      ability: LIT_ABILITY.LitActionExecution,
    },
  ],
});

// Run the lit action, which can use the secret internally
const response = await litNodeClient.executeJs({
  sessionSigs,
  ipfsCid,
  jsParams: {
    encryptedData,
    dataToEncryptHash,
    accessControlConditions,
  }
});
`;
}
