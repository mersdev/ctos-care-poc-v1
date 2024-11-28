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
  litigation: "None",
  tradeReference: "Good",
  bankingPaymentHistory: "Excellent",
  dishonouredCheques: "None"
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
  },
  // Add more companies here...
]);

export const fetchCTOSScore = () => simulateApiCall({
  score: 740,
  factors: [
    "Lack of recently established credit accounts",
    "No recent retail balance reported",
    "Too few loan and revolving/charge accounts with recent payment information"
  ]
});

export const fetchCTOSLitigationIndex = () => simulateApiCall({
  index: 8712,
  description: "Civil Suit/Summon 1 > 96 months 2 Number of records"
});

export const fetchAddressRecords = () => simulateApiCall([
  { address: "123 Main St, Kuala Lumpur, Malaysia", source: "CCRIS" },
  { address: "456 Tech St, Kuala Lumpur, Malaysia", source: "SSM" },
  { address: "789 Park Ave, Kuala Lumpur, Malaysia", source: "CTOS User ID" },
]);

export const fetchBankingPaymentHistory = () => simulateApiCall({
  approvedFacilities: 3,
  pendingFacilities: 1,
  totalOutstanding: 500000,
  totalLimit: 1000000,
  foreignExchangeContract: 0
});

export const fetchDishonouredCheques = () => simulateApiCall([
  { date: "01/05/2023", amount: 5000, reason: "Insufficient funds" },
]);

export const fetchCCRISSubjectComments = () => simulateApiCall([
  "No negative remarks",
]);

export const fetchCCRISDerivatives = () => simulateApiCall({
  earliestKnownFacility: "01/01/2015",
  securedFacilities: ["Housing Loan", "Car Loan"],
  unsecuredFacilities: ["Personal Loan", "Credit Card"]
});

export const fetchLegalCasesDefendant = () => simulateApiCall([
  {
    caseType: "Civil Suit",
    status: "Settled",
    petitioner: "XYZ Bank",
    caseNumber: "CS-123-2022",
    petitionDate: "01/03/2022",
    amount: 50000,
    comments: "Case settled out of court"
  },
]);

export const fetchLegalCasesPlaintiff = () => simulateApiCall([
  {
    caseType: "Small Claims",
    status: "Pending",
    petitioner: "John Doe",
    defendant: "ABC Company",
    caseNumber: "SC-456-2023",
    petitionDate: "01/06/2023",
    amount: 10000,
    comments: "Awaiting court date"
  },
]);

export const fetchAMLA = () => simulateApiCall({
  inquiries: 2,
  matches: []
});

export const fetchHistoricalEnquiry = () => simulateApiCall({
  financial: 5,
  nonFinancial: 2,
  lawyer: 1,
  others: 0
});

export const fetchTradeRefereeListing = () => simulateApiCall([
  {
    companyName: "Supplier Co.",
    dateSubmitted: "01/07/2023",
    creditLimit: 100000,
    outstandingAmount: 50000,
    paymentBehavior: "Prompt"
  },
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
    ccrisSubjectComments,
    ccrisDerivatives,
    legalCasesDefendant,
    legalCasesPlaintiff,
    amla,
    historicalEnquiry,
    tradeRefereeListing
  ] = await Promise.all([
    fetchIdVerification(),
    fetchCreditInfoAtAGlance(),
    fetchDirectorshipsBusinessInterests(),
    fetchCTOSScore(),
    fetchCTOSLitigationIndex(),
    fetchAddressRecords(),
    fetchBankingPaymentHistory(),
    fetchDishonouredCheques(),
    fetchCCRISSubjectComments(),
    fetchCCRISDerivatives(),
    fetchLegalCasesDefendant(),
    fetchLegalCasesPlaintiff(),
    fetchAMLA(),
    fetchHistoricalEnquiry(),
    fetchTradeRefereeListing()
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
    ccrisSubjectComments,
    ccrisDerivatives,
    legalCasesDefendant,
    legalCasesPlaintiff,
    amla,
    historicalEnquiry,
    tradeRefereeListing
  };
};
