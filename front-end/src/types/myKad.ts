export interface MyKadData {
  fullName: string;
  identityCardNumber: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
}

export interface ProfileFormData extends MyKadData {
  email: string;
  phone?: string;
}
