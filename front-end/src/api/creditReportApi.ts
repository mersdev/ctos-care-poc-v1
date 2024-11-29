import { CreditReportData } from '../types/creditReport';

// Simulating API calls with delays
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), Math.random() * 1000);
  });
};

export const fetchIdVerification = () => simulateApiCall({
  name: "John Smith",
  icNo: "123456-78-9012",
  dob: "01/01/1980",
  nationality: "Malaysian",
  address: "123 Main St, Kuala Lumpur, Malaysia"
});

export const fetchCreditInfoAtAGlance = () => simulateApiCall({
  creditScore: 750,
  creditUtilization: 30,
  totalAccounts: 5,
  totalDebt: 50000,
  paymentHistory: 98,
  creditMix: 85
});

export const fetchDirectorshipsBusinessInterests = () => simulateApiCall([
  {
    name: "ABC Corporation",
    status: "Active",
    natureOfBusiness: "Technology",
    incorporationDate: "01/01/2010",
    ccmDate: "01/01/2010",
    position: "Director",
    appointedDate: "01/01/2010",
    address: "456 Tech St, Kuala Lumpur, Malaysia",
    paidUpShares: "1,000,000"
  }
]);

export const fetchCTOSScore = () => simulateApiCall({
  score: 740,
  factors: [
    "Excellent payment history",
    "Low credit utilization",
    "Long credit history"
  ]
});

export const fetchCTOSLitigationIndex = () => simulateApiCall({
  index: 750,
  description: "Low risk - No significant legal issues found"
});

export const fetchAddressRecords = () => simulateApiCall([
  {
    address: "123 Main St, Kuala Lumpur",
    dateReported: "2023-01-01",
    source: "Bank Statement"
  }
]);

export const fetchBankingPaymentHistory = () => simulateApiCall({
  accounts: [
    {
      bank: "Maybank",
      accountType: "Credit Card",
      status: "Active",
      paymentHistory: "Excellent"
    }
  ]
});

export const fetchDishonouredCheques = () => simulateApiCall([
  {
    date: "2023-01-01",
    amount: 5000,
    bank: "CIMB",
    reason: "Insufficient funds"
  }
]);

export const fetchCCRISDerivatives = () => simulateApiCall({
  items: [
    {
      type: "Credit Card",
      details: "No overdue payments"
    }
  ]
});

export const fetchCCRISSubjectComments = () => simulateApiCall({
  comments: [
    "Good payment history",
    "No defaults recorded"
  ]
});

export const fetchLegalCases = () => simulateApiCall({
  asPlaintiff: [
    {
      caseNumber: "CV-2023-001",
      defendant: "XYZ Corp",
      details: "Contract dispute",
      status: "Pending"
    }
  ],
  asDefendant: [
    {
      caseNumber: "CV-2023-002",
      plaintiff: "ABC Bank",
      details: "Loan default",
      status: "Settled"
    }
  ]
});

export const fetchAMLA = () => simulateApiCall({
  data: {
    inquiries: 0,
    matches: []
  }
});

export const fetchHistoricalEnquiry = () => simulateApiCall([
  {
    date: "2023-12-01",
    enquirer: "Bank A",
    purpose: "Loan Application"
  }
]);

export const fetchTradeReferee = () => simulateApiCall([
  {
    company: "XYZ Trading",
    rating: "A",
    details: "Excellent payment record"
  }
]);

export const fetchCreditReportData = async (): Promise<CreditReportData> => {
  const [
    idVerification,
    creditInfoAtAGlance,
    directorshipsBusinessInterests,
    ctosScore,
    ctosLitigationIndex,
    addressRecords,
    bankingPaymentHistory,
    dishonouredCheques,
    ccrisDerivatives,
    ccrisSubjectComments,
    legalCases,
    amla,
    historicalEnquiry,
    tradeReferee
  ] = await Promise.all([
    fetchIdVerification(),
    fetchCreditInfoAtAGlance(),
    fetchDirectorshipsBusinessInterests(),
    fetchCTOSScore(),
    fetchCTOSLitigationIndex(),
    fetchAddressRecords(),
    fetchBankingPaymentHistory(),
    fetchDishonouredCheques(),
    fetchCCRISDerivatives(),
    fetchCCRISSubjectComments(),
    fetchLegalCases(),
    fetchAMLA(),
    fetchHistoricalEnquiry(),
    fetchTradeReferee()
  ]);

  return {
    idVerification,
    creditInfoAtAGlance,
    directorshipsBusinessInterests,
    ctosScore,
    ctosLitigationIndex,
    addressRecords,
    bankingPaymentHistory,
    dishonouredCheques,
    ccrisDerivatives,
    ccrisSubjectComments,
    legalCases,
    amla,
    historicalEnquiry,
    tradeReferee
  };
};
