export interface ConsentData {
  banks: string[];
  ssm: boolean;
  courtRecords: boolean;
  dcheqs: boolean;
  tradeReferees: boolean;
}

export interface ProfileData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  consents?: ConsentData;
  onboardingCompleted?: boolean;
  identityCardNumber?: string;
  dateOfBirth?: string;
  nationality?: string;
  publicKey?: string;
  keyLastUpdated?: string;
  encryptionEnabled?: boolean;
}

export interface EncryptedProfile {
  id: string;
  encrypted_data: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  updated_at: string;
}
