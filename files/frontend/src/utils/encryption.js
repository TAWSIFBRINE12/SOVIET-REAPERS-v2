import sodium from 'libsodium.js';

// Initialize libsodium
let initialized = false;

const init = async () => {
  if (!initialized) {
    await sodium.ready;
    initialized = true;
  }
};

/**
 * Generate a keypair for the user
 * @returns {Promise<{publicKey: string, privateKey: string}>}
 */
export const generateKeypair = async () => {
  await init();
  const keypair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keypair.publicKey),
    privateKey: sodium.to_base64(keypair.privateKey)
  };
};

/**
 * Encrypt a message using secretbox (symmetric encryption)
 * @param {string} message - The message to encrypt
 * @returns {Promise<{encrypted: string, nonce: string}>}
 */
export const encryptMessage = async (message) => {
  await init();
  
  // Get or create shared secret key from localStorage
  let key = localStorage.getItem('encryption_key');
  if (!key) {
    key = sodium.to_base64(sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES));
    localStorage.setItem('encryption_key', key);
  }
  
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const keyBytes = sodium.from_base64(key);
  const messageBytes = sodium.from_string(message);
  
  const encryptedBytes = sodium.crypto_secretbox_easy(messageBytes, nonce, keyBytes);
  
  return {
    encrypted: sodium.to_base64(encryptedBytes),
    nonce: sodium.to_base64(nonce)
  };
};

/**
 * Decrypt a message using secretbox (symmetric decryption)
 * @param {string} encrypted - The encrypted message (base64)
 * @param {string} nonce - The nonce (base64)
 * @returns {Promise<string>}
 */
export const decryptMessage = async (encrypted, nonce) => {
  await init();
  
  const key = localStorage.getItem('encryption_key');
  if (!key) throw new Error('No encryption key found');
  
  const keyBytes = sodium.from_base64(key);
  const encryptedBytes = sodium.from_base64(encrypted);
  const nonceBytes = sodium.from_base64(nonce);
  
  const decryptedBytes = sodium.crypto_secretbox_open_easy(encryptedBytes, nonceBytes, keyBytes);
  return sodium.to_string(decryptedBytes);
};

/**
 * Encrypt using public key (asymmetric)
 * @param {string} publicKey - Recipient's public key (base64)
 * @param {string} message - Message to encrypt
 * @returns {Promise<{encrypted: string, nonce: string}>}
 */
export const encryptWithPublicKey = async (publicKey, message) => {
  await init();
  
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const publicKeyBytes = sodium.from_base64(publicKey);
  const messageBytes = sodium.from_string(message);
  
  // You would need the private key to decrypt later
  const encryptedBytes = sodium.crypto_box_easy(messageBytes, nonce, publicKeyBytes);
  
  return {
    encrypted: sodium.to_base64(encryptedBytes),
    nonce: sodium.to_base64(nonce)
  };
};

export default {
  generateKeypair,
  encryptMessage,
  decryptMessage,
  encryptWithPublicKey
};