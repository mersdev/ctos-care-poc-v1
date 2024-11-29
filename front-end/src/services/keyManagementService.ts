import { ProfileService } from './profileService';
import { ProfileData } from '../types/profile';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class KeyManagementService {
  private static readonly PRIVATE_KEY_STORAGE_KEY = 'user_private_key';

  // Generate key pair using Web Crypto API
  static async generateKeyPair(): Promise<KeyPair> {
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256'
        },
        true,
        ['encrypt', 'decrypt']
      );

      // Export keys to PEM format
      const publicKeyBuffer = await window.crypto.subtle.exportKey(
        'spki',
        keyPair.publicKey
      );
      const privateKeyBuffer = await window.crypto.subtle.exportKey(
        'pkcs8',
        keyPair.privateKey
      );

      const publicKey = this.arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY');
      const privateKey = this.arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY');

      return { publicKey, privateKey };
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw new Error('Failed to generate encryption keys');
    }
  }

  // Store private key securely in browser
  static storePrivateKey(privateKey: string): void {
    try {
      localStorage.setItem(this.PRIVATE_KEY_STORAGE_KEY, privateKey);
    } catch (error) {
      console.error('Error storing private key:', error);
      throw new Error('Failed to store private key');
    }
  }

  // Get stored private key
  static getPrivateKey(): string | null {
    return localStorage.getItem(this.PRIVATE_KEY_STORAGE_KEY);
  }

  // Clear stored private key
  static clearPrivateKey(): void {
    localStorage.removeItem(this.PRIVATE_KEY_STORAGE_KEY);
  }

  // Initialize user keys
  static async initializeUserKeys(): Promise<void> {
    try {
      // Generate new key pair
      const keyPair = await this.generateKeyPair();
      
      // Store private key locally
      this.storePrivateKey(keyPair.privateKey);

      try {
        // Try to get existing profile
        const currentProfile = await ProfileService.getProfile();
        
        if (currentProfile) {
          // Update existing profile with new public key
          await ProfileService.updateProfile({
            ...currentProfile,
            publicKey: keyPair.publicKey,
            keyLastUpdated: new Date().toISOString(),
            encryptionEnabled: true
          });
        } else {
          // Create new profile with public key
          const newProfile: ProfileData = {
            name: '',
            email: '',
            publicKey: keyPair.publicKey,
            keyLastUpdated: new Date().toISOString(),
            encryptionEnabled: true
          };
          await ProfileService.createProfile(newProfile);
        }
      } catch (error) {
        // If profile operations fail, still keep the private key
        console.error('Error updating profile with public key:', error);
      }
    } catch (error) {
      console.error('Error initializing user keys:', error);
      throw new Error('Failed to initialize encryption keys');
    }
  }

  // Helper function to convert ArrayBuffer to PEM format
  private static arrayBufferToPem(buffer: ArrayBuffer, type: string): string {
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const pem = `-----BEGIN ${type}-----\n${this.formatPem(base64)}\n-----END ${type}-----`;
    return pem;
  }

  // Helper function to format PEM string
  private static formatPem(str: string): string {
    const chunkSize = 64;
    const chunks = str.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
    return chunks.join('\n');
  }
}
