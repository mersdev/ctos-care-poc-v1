import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchCreditReportData } from "@/api/creditReportApi";
import { OllamaReportService } from "@/services/ollamaReportService";
import type { CreditReportData } from "@/types/creditReport";
import IDVerification from "./IDVerification";
import CTOSScore from "./CTOSScore";
import CreditInfoAtAGlance from "./CreditInfoAtAGlance";
import CTOSLitigationIndex from "./CTOSLitigationIndex";
import CCRISDerivatives from "./CCRISDerivatives";
import CCRISSubjectComments from "./CCRISSubjectComments";
import BankingPaymentHistory from "./BankingPaymentHistory";
import DishonouredCheques from "./DishonouredCheques";
import LegalCasesPlaintiff from "./LegalCasesPlaintiff";
import LegalCasesDefendant from "./LegalCasesDefendant";
import AMLA from "./AMLA";
import DirectorshipsBusinessInterests from "./DirectorshipsBusinessInterests";
import AddressRecords from "./AddressRecords";
import HistoricalEnquiry from "./HistoricalEnquiry";
import TradeRefereeListing from "./TradeRefereeListing";
import Disclaimer from "./Disclaimer";
import SectionSummary from "./SectionSummary";
import CreditReportSkeleton from "./CreditReportSkeleton";
import { useAuthContext } from "@/contexts/AuthContext";

const CreditReport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CreditReportData | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const { user } = useAuthContext();

  interface Insights {
    score: number;
    trend: "up" | "down" | "stable";
    analysis: string;
    recommendations: string[];
  }

  const STORAGE_KEY = "ctos_credit_report";
  const STORAGE_EXPIRY_KEY = "ctos_credit_report_expiry";
  const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const getStoredData = () => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    const expiryTime = localStorage.getItem(STORAGE_EXPIRY_KEY);

    if (storedData && expiryTime) {
      const now = new Date().getTime();
      if (now < parseInt(expiryTime)) {
        return JSON.parse(storedData);
      }
      // Clear expired data
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_EXPIRY_KEY);
    }
    return null;
  };

  const storeData = (reportData: any, insightsData: any) => {
    const expiryTime = new Date().getTime() + CACHE_DURATION;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        report: reportData,
        insights: insightsData,
      })
    );
    localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        return;
      }

      try {
        setIsLoading(true);

        // Try to get data from local storage first
        const storedData = getStoredData();
        if (storedData) {
          setData(storedData.report);
          setInsights(storedData.insights);
          setIsLoading(false);
          return;
        }

        // If no stored data, fetch new data
        const creditReportData = await fetchCreditReportData();
        const analysis = await OllamaReportService.generateCreditReport();

        const reportData = {
          ...creditReportData,
          ctosScore: analysis.creditScore || creditReportData.ctosScore,
        };

        const insightsData: Insights = {
          score:
            analysis.creditScore?.score || creditReportData.ctosScore.score,
          trend: analysis.score > 700 ? ("up" as const) : ("down" as const),
          analysis: analysis.summary || "",
          recommendations: analysis.recommendations || [],
        };

        setData(reportData);
        setInsights(insightsData);

        // Store the new data in local storage
        storeData(reportData, insightsData);
      } catch (error) {
        console.error("Error fetching credit report data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <CreditReportSkeleton />;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            CTOS Credit Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <SectionSummary
          title="Personal Information & Credit Scores"
          data={{
            "Credit Score": data.ctosScore?.score?.toString() || "N/A",
            "Credit Mix": `${data.creditInfoAtAGlance?.creditMix || 0}%`,
            "Payment History": `${
              data.creditInfoAtAGlance?.paymentHistory || 0
            }%`,
            "Credit Utilization": `${
              data.creditInfoAtAGlance?.creditUtilization || 0
            }%`,
          }}
          insights={
            insights
              ? {
                  score: insights.score,
                  trend: insights.trend,
                  analysis: insights.analysis,
                  recommendations: insights.recommendations,
                }
              : undefined
          }
        />

        <div className="grid gap-6 md:grid-cols-2">
          <IDVerification data={data.idVerification} />
          <CTOSScore data={data.ctosScore} />
        </div>

        <CreditInfoAtAGlance data={data.creditInfoAtAGlance} />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="banking">Banking</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="other">Other Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6">
              <CTOSLitigationIndex data={data.ctosLitigationIndex} />
              <CCRISDerivatives data={data.ccrisDerivatives} />
              <CCRISSubjectComments data={data.ccrisSubjectComments} />
            </div>
          </TabsContent>

          <TabsContent value="banking">
            <div className="grid gap-6">
              <BankingPaymentHistory
                accounts={data.bankingPaymentHistory?.accounts}
              />
              <DishonouredCheques data={data.dishonouredCheques} />
              <TradeRefereeListing data={data.tradeReferee} />
            </div>
          </TabsContent>

          <TabsContent value="legal">
            <div className="grid gap-6">
              <LegalCasesPlaintiff data={data.legalCases?.asPlaintiff} />
              <LegalCasesDefendant data={data.legalCases?.asDefendant} />
              <AMLA
                data={{
                  inquiries: data.amla?.data?.inquiries ?? 0,
                  matches: data.amla?.data?.matches ?? [],
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="business">
            <DirectorshipsBusinessInterests
              interests={data.directorshipsBusinessInterests}
            />
            <DirectorshipsBusinessInterests
              interests={data.directorshipsBusinessInterests}
            />
          </TabsContent>

          <TabsContent value="other">
            <div className="grid gap-6">
              <AddressRecords addresses={data.addressRecords} />
              <HistoricalEnquiry data={data.historicalEnquiry} />
            </div>
          </TabsContent>
        </Tabs>

        <Disclaimer />
      </div>
    </div>
  );
};

export default CreditReport;
