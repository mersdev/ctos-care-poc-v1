export interface ProfileData {
  id?: string;
  user_id?: string;
  name?: string;
  email: string;
  phone?: string;
  address?: string;
  identity_card_number?: string;
  date_of_birth?: string;
  nationality?: string;
  encrypted_data: string;
  encryption_enabled: boolean;
  public_key?: string;
  key_last_updated?: string;
  consents?: {
    banks: string[];
    ssm: boolean;
    courtRecords: boolean;
    dcheqs: boolean;
    tradeReferees: boolean;
  };
  onboarding_completed?: boolean;
}

export interface ProfileRequest {
  email: string;
  encrypted_data?: string;
  encryption_enabled: boolean;
  public_key?: string;
  consents: {
    banks: string[];
    ssm: boolean;
    courtRecords: boolean;
    dcheqs: boolean;
    tradeReferees: boolean;
  };
}

export interface ProfileResponse extends ProfileRequest {
  id: string;
  user_id: string;
  key_last_updated: string;
  created_at: string;
  updated_at: string;
}

export interface ExtractedInfo {
  full_name?: string;
  identity_card_number?: string;
  date_of_birth?: string;
  address?: string;
  nationality?: string;
}
