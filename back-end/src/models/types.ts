export interface ConsentData {
  banks: string[];
  ssm: boolean;
  courtRecords: boolean;
  dcheqs: boolean;
  tradeReferees: boolean;
}

export interface ProfileData {
  id?: string;
  user_id?: string;
  email: string;
  encrypted_data?: string;
  encryption_enabled?: boolean;
  public_key?: string;
  key_last_updated?: string;
  consents?: ConsentData;
}
