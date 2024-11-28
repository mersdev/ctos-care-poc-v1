export interface IDVerification {
  name: string;
  icNo: string;
  dob: string;
  nationality: string;
  address: string;
}

export interface CreditInfoAtAGlance {
  litigation: string;
  tradeReference: string;
  bankingPaymentHistory: string;
  dishonouredCheques: string;
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
  source: string;
}

export interface BankingPaymentHistory {
  approvedFacilities: number;
  pendingFacilities: number;
  totalOutstanding: number;
  totalLimit: number;
  foreignExchangeContract: number;
}

export interface DishonouredCheque {
  date: string;
  amount: number;
  reason: string;
}

export interface CCRISDerivatives {
  earliestKnownFacility: string;
  securedFacilities: string[];
  unsecuredFacilities: string[];
}

export interface LegalCase {
  caseType: string;
  status: string;
  petitioner: string;
  caseNumber: string;
  petitionDate: string;
  amount: number;
  comments: string;
}

export interface AMLA {
  inquiries: number;
  matches: { name: string; icNumber: string }[];
}

export interface HistoricalEnquiry {
  financial: number;
  nonFinancial: number;
  lawyer: number;
  others: number;
}

export interface TradeReferee {
  companyName: string;
  dateSubmitted: string;
  creditLimit: number;
  outstandingAmount: number;
  paymentBehavior: string;
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
  ccrisSubjectComments: string[];
  ccrisDerivatives: CCRISDerivatives;
  legalCasesDefendant: LegalCase[];
  legalCasesPlaintiff: LegalCase[];
  amla: AMLA;
  historicalEnquiry: HistoricalEnquiry;
  tradeRefereeListing: TradeReferee[];
}

