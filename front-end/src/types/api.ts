export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  description: string;
}

export interface PersonalInfo {
  name: string;
  license_no: string;
  identity_no: string;
  phone_number: string;
  email: string;
  address: string;
  occupation: string;
  personal_summary: string;
}

export interface UserProfile {
  personal_info: PersonalInfo;
  trainings: Training[];
}

export interface Training {
  id: number;
  name: string;
  date_start: string;
  date_end: string;
  provider: string;
  type: string;
}

export interface CustomerFeedback {
  id: string;
  date: string;
  rating: number;
  comment: string;
  trip_id: string;
}

export interface Trading {
  id: number;
  code: number;
  name: string;
  invested_price: number;
  current_price: number;
  type: string;
}
