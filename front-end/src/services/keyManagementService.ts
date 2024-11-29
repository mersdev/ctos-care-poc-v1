import { ProfileData } from "../types/profile";

export interface KeyPair {
  public_key: string;
  private_key: string;
}

export class KeyManagementService {
  private static readonly private_key_storage_key = "profile_private_key";
  private static readonly public_key_storage_key = "profile_public_key";

  static async encrypt_profile_data(
    data: ProfileData,
    public_key: string
  ): Promise<string> {
    try {
      // Only encrypt sensitive data fields
      const sensitive_data = {
        name: data.name,
        phone: data.phone,
        address: data.address,
        identity_card_number: data.identity_card_number,
        date_of_birth: data.date_of_birth,
        nationality: data.nationality,
      };

      // Generate a random AES key for encrypting the data
      const aes_key = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Export the AES key
      const raw_key = await window.crypto.subtle.exportKey("raw", aes_key);

      // Convert PEM public key to CryptoKey for RSA
      const public_key_buffer = await this.pem_to_array_buffer(public_key, "PUBLIC KEY");
      const rsa_key = await window.crypto.subtle.importKey(
        "spki",
        public_key_buffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["encrypt"]
      );

      // Encrypt the AES key with RSA
      const encrypted_key = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        rsa_key,
        raw_key
      );

      // Generate a random IV for AES-GCM
      const iv = window.crypto.getRandomValues(new Uint8Array(12));

      // Convert data to ArrayBuffer
      const encoder = new TextEncoder();
      const data_buffer = encoder.encode(JSON.stringify(sensitive_data));

      // Encrypt the data with AES
      const encrypted_data = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        aes_key,
        data_buffer
      );

      // Combine all the encrypted components
      const combined = {
        key: this.array_buffer_to_base64(encrypted_key),
        iv: this.array_buffer_to_base64(iv),
        data: this.array_buffer_to_base64(encrypted_data),
      };

      return JSON.stringify(combined);
    } catch (error) {
      console.error("Encryption error:", error);
      throw error;
    }
  }

  static async decrypt_profile_data(
    encrypted_data: string,
    private_key: string
  ): Promise<Partial<ProfileData>> {
    try {
      // Parse the encrypted data
      const encrypted_data_json = JSON.parse(encrypted_data);
      const encrypted_key = this.base64_to_array_buffer(encrypted_data_json.key);
      const iv = this.base64_to_array_buffer(encrypted_data_json.iv);
      const encrypted_data_buffer = this.base64_to_array_buffer(encrypted_data_json.data);

      // Convert PEM private key to CryptoKey
      const private_key_buffer = await this.pem_to_array_buffer(private_key, "PRIVATE KEY");
      const rsa_key = await window.crypto.subtle.importKey(
        "pkcs8",
        private_key_buffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        true,
        ["decrypt"]
      );

      // Decrypt the AES key with RSA
      const raw_key = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        rsa_key,
        encrypted_key
      );

      // Import the decrypted AES key
      const aes_key = await window.crypto.subtle.importKey(
        "raw",
        raw_key,
        {
          name: "AES-GCM",
        },
        false,
        ["decrypt"]
      );

      // Decrypt the data with AES
      const decrypted_data = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        aes_key,
        encrypted_data_buffer
      );

      // Convert decrypted data back to object
      const decoder = new TextDecoder();
      const json_string = decoder.decode(decrypted_data);
      return JSON.parse(json_string);
    } catch (error) {
      console.error("Failed to decrypt profile data:", error);
      throw new Error(
        "Failed to decrypt profile data. Please check your encryption keys."
      );
    }
  }

  static async generate_key_pair(): Promise<KeyPair> {
    try {
      const key_pair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Export keys to PEM format
      const public_key_buffer = await window.crypto.subtle.exportKey(
        "spki",
        key_pair.publicKey
      );
      const private_key_buffer = await window.crypto.subtle.exportKey(
        "pkcs8",
        key_pair.privateKey
      );

      const public_key = this.array_buffer_to_pem(
        public_key_buffer,
        "PUBLIC KEY"
      );
      const private_key = this.array_buffer_to_pem(
        private_key_buffer,
        "PRIVATE KEY"
      );

      return { public_key, private_key };
    } catch (error) {
      console.error("Error generating key pair:", error);
      throw new Error("Failed to generate encryption keys");
    }
  }

  static async initialize_user_keys(): Promise<void> {
    try {
      const key_pair = await this.generate_key_pair();
      localStorage.setItem(this.public_key_storage_key, key_pair.public_key);
      localStorage.setItem(this.private_key_storage_key, key_pair.private_key);
    } catch (error) {
      console.error("Error initializing user keys:", error);
      throw new Error("Failed to initialize encryption keys");
    }
  }

  static get_public_key(): string | null {
    return localStorage.getItem(this.public_key_storage_key);
  }

  static get_private_key(): string | null {
    return localStorage.getItem(this.private_key_storage_key);
  }

  // Convert ArrayBuffer to base64
  private static array_buffer_to_base64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Convert base64 to ArrayBuffer
  private static base64_to_array_buffer(base64: string): ArrayBuffer {
    const binary_string = atob(base64);
    const bytes = new Uint8Array(binary_string.length);
    for (let i = 0; i < binary_string.length; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Convert ArrayBuffer to PEM format
  private static array_buffer_to_pem(
    buffer: ArrayBuffer,
    type: "PUBLIC KEY" | "PRIVATE KEY"
  ): string {
    const base64 = this.array_buffer_to_base64(buffer);
    const pem = `-----BEGIN ${type}-----\n${base64}\n-----END ${type}-----`;
    return pem;
  }

  // Convert PEM to ArrayBuffer
  private static async pem_to_array_buffer(
    pem: string,
    type: "PUBLIC KEY" | "PRIVATE KEY"
  ): Promise<ArrayBuffer> {
    // Remove header, footer and newlines
    const pem_contents = pem
      .replace(`-----BEGIN ${type}-----`, "")
      .replace(`-----END ${type}-----`, "")
      .replace(/\s/g, "");

    // Decode base64 to binary
    const binary = atob(pem_contents);

    // Convert to Uint8Array
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }

    return buffer.buffer;
  }

  static clear_keys(): void {
    localStorage.removeItem(this.private_key_storage_key);
    localStorage.removeItem(this.public_key_storage_key);
  }

  static has_keys(): boolean {
    return !!(
      localStorage.getItem(this.private_key_storage_key) &&
      localStorage.getItem(this.public_key_storage_key)
    );
  }
}
