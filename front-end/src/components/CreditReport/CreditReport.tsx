import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IDVerification from "./IDVerification";
import CreditInfoAtAGlance from "./CreditInfoAtAGlance";
import DirectorshipsBusinessInterests from "./DirectorshipsBusinessInterests";
import CTOSScore from "./CTOSScore";
import CTOSLitigationIndex from "./CTOSLitigationIndex";
import BankingPaymentHistory from "./BankingPaymentHistory";
import AddressRecords from "./AddressRecords";

interface CreditReportData {
  idVerification: {
    name: string;
    icNo: string;
    dob: string;
    nationality: string;
    address: string;
  };
  creditInfoAtAGlance: {
    creditScore: number;
    creditUtilization: number;
    totalAccounts: number;
    totalDebt: number;
    paymentHistory: number;
    creditMix: number;
  };
  directorshipsBusinessInterests: Array<{
    name: string;
    status: string;
    natureOfBusiness: string;
    incorporationDate: string;
    ccmDate: string;
    position: string;
    appointedDate: string;
    address: string;
    paidUpShares: string;
  }>;
  ctosScore: {
    score: number;
    factors: string[];
  };
  ctosLitigationIndex: {
    index: number;
    description: string;
  };
  bankingPaymentHistory: {
    accounts: Array<{
      bank: string;
      accountType: string;
      status: string;
      paymentHistory: string;
    }>;
  };
  addressRecords: Array<{
    address: string;
    dateReported: string;
    source: string;
  }>;
}

interface CreditReportProps {
  data: Partial<CreditReportData>;
}

const CreditReport: React.FC<CreditReportProps> = ({ data = {} }) => {
  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold">CTOS Credit Report </h1>
      <p className="text-muted-foreground mb-6">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <div className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <IDVerification data={data.idVerification} />
          <CTOSScore data={data.ctosScore} />
        </div>

        <CreditInfoAtAGlance data={data.creditInfoAtAGlance} />

        <Tabs defaultValue="litigation" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="litigation">Litigation</TabsTrigger>
            <TabsTrigger value="banking">Banking History</TabsTrigger>
            <TabsTrigger value="business">Business Interests</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>
          <TabsContent value="litigation">
            <CTOSLitigationIndex data={data.ctosLitigationIndex} />
          </TabsContent>
          <TabsContent value="banking">
            <BankingPaymentHistory
              accounts={data.bankingPaymentHistory?.accounts}
            />
          </TabsContent>
          <TabsContent value="business">
            <DirectorshipsBusinessInterests
              interests={data.directorshipsBusinessInterests}
            />
          </TabsContent>
          <TabsContent value="addresses">
            <AddressRecords addresses={data.addressRecords} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreditReport;
