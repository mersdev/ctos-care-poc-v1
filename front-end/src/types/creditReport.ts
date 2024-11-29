export interface IDVerification {
  name: string;
  icNo: string;
  dob: string;
  nationality: string;
  address: string;
}

export interface CreditInfoAtAGlance {
  creditScore: number;
  creditUtilization: number;
  totalAccounts: number;
  totalDebt: number;
  paymentHistory: number;
  creditMix: number;
}

export interface DirectorshipBusinessInterest {
  name: string;
  status: string;
  natureOfBusiness: string;
  incorporationDate: string;
  ccmDate: string;
  position: string;
  appointedDate: string;
  address: string;
  paidUpShares: string;
}

export interface CTOSScore {
  score: number;
  factors: string[];
}

export interface CTOSLitigationIndex {
  index: number;
  description: string;
}

export interface AddressRecord {
  address: string;
  dateReported: string;
  source: string;
}

export interface BankingAccount {
  bank: string;
  accountType: string;
  status: string;
  paymentHistory: string;
}

export interface BankingPaymentHistory {
  accounts: BankingAccount[];
}

export interface DishonouredCheque {
  date: string;
  amount: number;
  bank: string;
  reason: string;
}

export interface CCRISDerivative {
  type: string;
  details: string;
}

export interface CCRISData {
  items: CCRISDerivative[];
}

export interface CCRISSubjectComments {
  comments: string[];
}

export interface LegalCase {
  caseNumber: string;
  details: string;
  status: string;
}

export interface LegalCasePlaintiff extends LegalCase {
  defendant: string;
}

export interface LegalCaseDefendant extends LegalCase {
  plaintiff: string;
}

export interface AMLA {
  data: {
    inquiries: number;
    matches: Array<{
      name: string;
      icNumber: string;
    }>;
  };
}

export interface HistoricalEnquiry {
  date: string;
  enquirer: string;
  purpose: string;
}

export interface TradeReferee {
  company: string;
  rating: string;
  details: string;
}

export interface CreditReportData {
  idVerification: IDVerification;
  creditInfoAtAGlance: CreditInfoAtAGlance;
  directorshipsBusinessInterests: DirectorshipBusinessInterest[];
  ctosScore: CTOSScore;
  ctosLitigationIndex: CTOSLitigationIndex;
  addressRecords: AddressRecord[];
  bankingPaymentHistory: BankingPaymentHistory;
  dishonouredCheques: DishonouredCheque[];
  ccrisDerivatives: CCRISData;
  ccrisSubjectComments: CCRISSubjectComments;
  tradeReferee: TradeReferee[];
  historicalEnquiry: HistoricalEnquiry[];
  amla: AMLA;
  legalCases: {
    asPlaintiff: LegalCasePlaintiff[];
    asDefendant: LegalCaseDefendant[];
  };
}
