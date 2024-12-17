export function generateExampleCode(secretObject) {
  return `// Example code for using your encrypted secret
const { encryptedData, dataToEncryptHash } = ${JSON.stringify(secretObject, null, 2)};

// Initialize Lit client
const client = new LitNodeClient();
await client.connect();

// Your decryption logic here
const decryptedString = await client.decrypt({
  // ... decryption parameters
});
`;
}
