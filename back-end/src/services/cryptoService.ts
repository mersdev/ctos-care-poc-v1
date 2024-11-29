import { generateKeyPairSync, publicEncrypt, privateDecrypt, constants } from 'crypto';
import { supabase } from '../config/supabase.js';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class CryptoService {
  // Generate RSA key pair
  static generateKeyPair(): KeyPair {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return {
      publicKey,
      privateKey
    };
  }

  // Encrypt data using recipient's public key
  static encryptData(data: any, recipientPublicKey: string): string {
    const buffer = Buffer.from(JSON.stringify(data));
    const encrypted = publicEncrypt(
      {
        key: recipientPublicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
      },
      buffer
    );
    return encrypted.toString('base64');
  }

  // Decrypt data using own private key
  static decryptData(encryptedData: string, privateKey: string): any {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = privateDecrypt(
      {
        key: privateKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING
      },
      buffer
    );
    return JSON.parse(decrypted.toString());
  }

  // Store public key in database
  static async storePublicKey(userId: string, publicKey: string): Promise<void> {
    const { error } = await supabase
      .from('user_keys')
      .upsert({ user_id: userId, public_key: publicKey });

    if (error) throw error;
  }

  // Retrieve public key from database
  static async getPublicKey(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('user_keys')
      .select('public_key')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data?.public_key || null;
  }
}
