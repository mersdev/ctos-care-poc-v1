import {
  CreditReportData,
  DirectorshipBusinessInterest,
  TradeReferee,
} from "../types/creditReport";
import { profileApi } from "./authApi";
import { KeyManagementService } from "@/services/keyManagementService";
import companyData from "../mock/company.json";
import tradeData from "../mock/trade.json";
import { OllamaReportService } from "@/services/ollamaReportService";

// Simulating API calls with delays
const simulateApiCall = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), Math.random() * 1000);
  });
};

// Data transformation functions
const transformCompanyData = (
  company: (typeof companyData.companies)[0]
): DirectorshipBusinessInterest => ({
  name: company.name,
  status: "Active",
  natureOfBusiness: company.nature_of_business,
  incorporationDate: company.incorporation_date,
  ccmDate: company.incorporation_date,
  position: company.position,
  appointedDate: company.appoint_date,
  address: "Bangsar South, Kuala Lumpur",
  paidUpShares: `${company.shareholding}%`,
});

const transformTradeData = (
  trade: (typeof tradeData.trade_referees)[0]
): TradeReferee => ({
  company: trade.name,
  rating: "A",
  details: `${trade.nature_of_business} - Based in ${trade.address}`,
});

export const fetchSectionSummary = async () => {
  try {
    const analysis = await OllamaReportService.generateCreditReport();
    if (analysis) {
      return {
        score: analysis.score,
        trend: analysis.score > 700 ? "up" : "down",
        recommendations: analysis.recommendations,
      };
    }

    return simulateApiCall({
      score: 725,
      trend: "up",
      recommendations: ["Recommendation 1", "Recommendation 2"],
    });
  } catch (error) {
    console.error("Error fetching section summary:", error);
    throw error;
  }
};

export const fetchIdVerification = async () => {
  try {
    // Fetch and decrypt profile data
    const encryptedProfile = await profileApi.getProfile();
    console.log(encryptedProfile);
    if (encryptedProfile) {
      const privateKey = KeyManagementService.get_private_key();
      if (privateKey) {
        const decryptedProfile =
          await KeyManagementService.decrypt_profile_data(
            encryptedProfile.encrypted_data ?? "",
            privateKey
          );

        if (decryptedProfile) {
          return {
            name: decryptedProfile.name ?? "",
            icNo: decryptedProfile.identity_card_number ?? "",
            dob: decryptedProfile.date_of_birth ?? "",
            nationality: decryptedProfile.nationality ?? "",
            address: decryptedProfile.address ?? "",
          };
        }
      }
    }

    // Fallback to mock data if profile fetch/decrypt fails
    return simulateApiCall({
      name: "John Smith",
      icNo: "123456-78-9012",
      dob: "01/01/1980",
      nationality: "Malaysian",
      address: "123 Main St, Kuala Lumpur, Malaysia",
    });
  } catch (error) {
    console.error("Error fetching ID verification:", error);
    throw error;
  }
};

export const fetchCreditInfoAtAGlance = () =>
  simulateApiCall({
    creditScore: 725,
    creditUtilization: 20,
    totalAccounts: 2,
    totalDebt: 24100, // 2100 CC + 22000 Education loan
    paymentHistory: 95,
    creditMix: 70,
  });

export const fetchDirectorshipsBusinessInterests = () =>
  simulateApiCall([
    ...companyData.companies.map(transformCompanyData),
    {
      name: "TechCraft Solutions Sdn Bhd",
      status: "Active",
      natureOfBusiness: "Software Development & Consulting",
      incorporationDate: "2023-03-15",
      ccmDate: "2023-03-15",
      position: "Director",
      appointedDate: "2023-03-15",
      address: "Bangsar South, Kuala Lumpur",
      paidUpShares: "100%",
    },
  ]);

export const fetchCTOSScore = () =>
  simulateApiCall({
    score: 725,
    previousScore: 698,
    lastUpdated: "2024-01-15",
    factors: [
      "Consistent payment history on credit cards",
      "Low credit utilization",
      "Recent salary increase",
      "Length of credit history is relatively short",
    ],
  });

export const fetchCTOSLitigationIndex = () =>
  simulateApiCall({
    index: 850,
    previousIndex: 850,
    lastUpdated: "2024-01-15",
    description: "Very Low Risk - No legal issues found",
  });

export const fetchAddressRecords = () =>
  simulateApiCall([
    {
      address: tradeData.trade_referees[0].address,
      dateReported: "2023-06-01",
      source: "Previous Employment",
    },
    {
      address: "Unit 15-3, The Horizon, Bangsar South, 59200 Kuala Lumpur",
      dateReported: "2023-09-15",
      source: "Current Residence",
    },
  ]);

export const fetchBankingPaymentHistory = () =>
  simulateApiCall({
    accounts: [
      {
        bank: "Maybank",
        accountType: "Credit Card",
        status: "Active",
        paymentHistory: "Excellent - No missed payments",
        creditLimit: 12000,
        outstandingBalance: 2100,
        lastPaymentDate: "2024-01-10",
      },
      {
        bank: "CIMB",
        accountType: "Personal Loan",
        status: "Active",
        paymentHistory: "Good - Occasional 1-2 days late",
        originalAmount: 30000,
        outstandingBalance: 22000,
        purpose: "Education Loan",
        lastPaymentDate: "2024-01-05",
      },
    ],
  });

export const fetchDishonouredCheques = () => simulateApiCall([]);

export const fetchCCRISDerivatives = () =>
  simulateApiCall({
    items: [
      {
        type: "Credit Card",
        details: "Regular payments, low utilization",
        status: "Performing",
      },
      {
        type: "Education Loan",
        details: "Regular payments with occasional delays",
        status: "Performing",
      },
    ],
  });

export const fetchCCRISSubjectComments = () =>
  simulateApiCall({
    comments: [
      "Good payment history on credit facilities",
      "No defaults or late payments exceeding 30 days",
      "Credit profile typical of young professional",
    ],
  });

export const fetchLegalCases = () =>
  simulateApiCall({
    asPlaintiff: [],
    asDefendant: [],
  });

export const fetchAMLA = () =>
  simulateApiCall({
    status: "CLEAR",
    lastChecked: "2024-01-15",
    data: {
      inquiries: 0,
      matches: [],
    },
  });

export const fetchHistoricalEnquiry = () =>
  simulateApiCall([
    {
      date: "2023-12-10",
      enquirer: "Hong Leong Bank",
      purpose: "Credit Card Application",
    },
    {
      date: "2023-09-15",
      enquirer: "Property Agent X",
      purpose: "Rental Background Check",
    },
  ]);

export const fetchTradeReferee = () =>
  simulateApiCall([
    ...tradeData.trade_referees.map(transformTradeData),
    {
      company: "Digital Ocean",
      rating: "A",
      details: "Cloud services subscription - Regular monthly payments",
      relationship: "Service Provider",
      monthsOfRelationship: 24,
    },
    {
      company: "AWS",
      rating: "A",
      details: "Cloud infrastructure - Consistent payment record",
      relationship: "Service Provider",
      monthsOfRelationship: 18,
    },
    {
      company: "Google Cloud",
      rating: "A",
      details: "Cloud services subscription - Regular monthly payments",
      relationship: "Service Provider",
      monthsOfRelationship: 12,
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
    ccrisDerivatives,
    ccrisSubjectComments,
    legalCases,
    amla,
    historicalEnquiry,
    tradeReferee,
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
    fetchTradeReferee(),
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
    tradeReferee,
  };
};
