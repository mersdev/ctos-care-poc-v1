import { CryptoService } from "../services/cryptoService.js";

export const EncryptionService = {
  // Encrypt data using recipient's public key
  encrypt: async <T>(data: T, recipientId: string): Promise<string> => {
    try {
      // Get recipient's public key
      const publicKey = await CryptoService.getPublicKey(recipientId);
      if (!publicKey) {
        throw new Error("Recipient's public key not found");
      }

      // Convert data to string and encrypt
      return CryptoService.encryptData(data, publicKey);
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Encryption failed");
    }
  },

  // Decrypt data using user's private key
  decrypt: <T>(encryptedData: string, privateKey: string): T => {
    try {
      // Decrypt data
      const decryptedString = CryptoService.decryptData(encryptedData, privateKey);
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Decryption failed");
    }
  }
};
