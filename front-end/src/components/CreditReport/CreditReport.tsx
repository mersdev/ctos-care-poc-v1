import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileApi } from "@/api/authApi";
import { KeyManagementService } from "@/services/keyManagementService";
import { fetchCreditReportData } from "@/api/creditReportApi";
import { CreditReportData } from "@/types/creditReport";
import IDVerification from "./IDVerification";
import CreditInfoAtAGlance from "./CreditInfoAtAGlance";
import DirectorshipsBusinessInterests from "./DirectorshipsBusinessInterests";
import CTOSScore from "./CTOSScore";
import CTOSLitigationIndex from "./CTOSLitigationIndex";
import BankingPaymentHistory from "./BankingPaymentHistory";
import AddressRecords from "./AddressRecords";
import CCRISDerivatives from "./CCRISDerivatives";
import CCRISSubjectComments from "./CCRISSubjectComments";
import Disclaimer from "./Disclaimer";
import TradeRefereeListing from "./TradeRefereeListing";
import HistoricalEnquiry from "./HistoricalEnquiry";
import AMLA from "./AMLA";
import LegalCasesPlaintiff from "./LegalCasesPlaintiff";
import LegalCasesDefendant from "./LegalCasesDefendant";
import DishonouredCheques from "./DishonouredCheques";
import SectionSummary from "./SectionSummary";
import CreditReportSkeleton from "./CreditReportSkeleton";

const CreditReport: React.FC = () => {
  const [data, setData] = useState<Partial<CreditReportData>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch credit report data
        const creditReportData = await fetchCreditReportData();

        // Fetch and decrypt profile data
        const encryptedProfile = await profileApi.getProfile();
        if (encryptedProfile) {
          const privateKey = KeyManagementService.get_private_key();
          if (privateKey) {
            const decryptedProfile =
              await KeyManagementService.decrypt_profile_data(
                encryptedProfile.encrypted_data ?? "",
                privateKey
              );

            // Merge profile data with credit report data
            if (decryptedProfile) {
              setData({
                ...creditReportData,
                idVerification: {
                  name: decryptedProfile.name ?? "",
                  icNo: decryptedProfile.identity_card_number ?? "",
                  dob: decryptedProfile.date_of_birth ?? "",
                  nationality: decryptedProfile.nationality ?? "",
                  address: decryptedProfile.address ?? "",
                },
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <CreditReportSkeleton />
      ) : (
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
      )}
    </>
  );
};

export default CreditReport;
