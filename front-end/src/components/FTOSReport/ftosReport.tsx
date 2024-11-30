import { useEffect, useState } from "react";
import { OllamaFTOSReportService } from "@/services/ollamaFTOReportService";
import {
  BehavioralMetrics,
  CashFlowMetrics,
  CreditMetrics,
  IDVerificationData,
  IncomeMetrics,
  ProjectionMetrics,
  OtherMetrics,
} from "@/types/ftos";
import IncomeAssessment from "./incomeAssessment";
import CreditHistoryEvaluation from "./creditHistoryEvaluation";
import CashFlowAnalysis from "./cashFlowAnalysis";
import FutureProjections from "./futureProjections";
import FtosReportSummary from "./FtosReportSummary";
import IDVerification from "./IDVerification";
import BehavioralFinancialMetrics from "./behavioralFinancialMetrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUserProfile } from "@/api/ftosReportApi";
import OtherFinancialMetrics from "./otherFinancialMetrics";

export default function FtosReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [incomeMetrics, setIncomeMetrics] = useState<IncomeMetrics>(() => {
    const saved = localStorage.getItem('ftos_income_metrics');
    return saved ? JSON.parse(saved) : {} as IncomeMetrics;
  });
  const [creditMetrics, setCreditMetrics] = useState<CreditMetrics>(() => {
    const saved = localStorage.getItem('ftos_credit_metrics');
    return saved ? JSON.parse(saved) : {} as CreditMetrics;
  });
  const [cashFlowMetrics, setCashFlowMetrics] = useState<CashFlowMetrics>(() => {
    const saved = localStorage.getItem('ftos_cashflow_metrics');
    return saved ? JSON.parse(saved) : {} as CashFlowMetrics;
  });
  const [projectionMetrics, setProjectionMetrics] = useState<ProjectionMetrics>(() => {
    const saved = localStorage.getItem('ftos_projection_metrics');
    return saved ? JSON.parse(saved) : {} as ProjectionMetrics;
  });
  const [behavioralMetrics, setBehavioralMetrics] = useState<BehavioralMetrics>(() => {
    const saved = localStorage.getItem('ftos_behavioral_metrics');
    return saved ? JSON.parse(saved) : {} as BehavioralMetrics;
  });
  const [otherMetrics, setOtherMetrics] = useState<OtherMetrics>(() => {
    const saved = localStorage.getItem('ftos_other_metrics');
    return saved ? JSON.parse(saved) : {} as OtherMetrics;
  });
  const [idVerification, setIdVerification] = useState<IDVerificationData>(() => {
    const saved = localStorage.getItem('ftos_id_verification');
    return saved ? JSON.parse(saved) : {} as IDVerificationData;
  });

  // Save to localStorage whenever metrics change
  useEffect(() => {
    if (Object.keys(incomeMetrics).length > 0) {
      localStorage.setItem('ftos_income_metrics', JSON.stringify(incomeMetrics));
    }
  }, [incomeMetrics]);

  useEffect(() => {
    if (Object.keys(creditMetrics).length > 0) {
      localStorage.setItem('ftos_credit_metrics', JSON.stringify(creditMetrics));
    }
  }, [creditMetrics]);

  useEffect(() => {
    if (Object.keys(cashFlowMetrics).length > 0) {
      localStorage.setItem('ftos_cashflow_metrics', JSON.stringify(cashFlowMetrics));
    }
  }, [cashFlowMetrics]);

  useEffect(() => {
    if (Object.keys(projectionMetrics).length > 0) {
      localStorage.setItem('ftos_projection_metrics', JSON.stringify(projectionMetrics));
    }
  }, [projectionMetrics]);

  useEffect(() => {
    if (Object.keys(behavioralMetrics).length > 0) {
      localStorage.setItem('ftos_behavioral_metrics', JSON.stringify(behavioralMetrics));
    }
  }, [behavioralMetrics]);

  useEffect(() => {
    if (Object.keys(otherMetrics).length > 0) {
      localStorage.setItem('ftos_other_metrics', JSON.stringify(otherMetrics));
    }
  }, [otherMetrics]);

  useEffect(() => {
    if (Object.keys(idVerification).length > 0) {
      localStorage.setItem('ftos_id_verification', JSON.stringify(idVerification));
    }
  }, [idVerification]);

  useEffect(() => {
    setLoading(true);

    // Check if we have all required data in localStorage
    const hasAllData = [
      'ftos_income_metrics',
      'ftos_credit_metrics',
      'ftos_cashflow_metrics',
      'ftos_projection_metrics'
    ].every(key => {
      const data = localStorage.getItem(key);
      return data && Object.keys(JSON.parse(data)).length > 0;
    });

    // Only fetch if we don't have all data
    if (!hasAllData) {
      fetchMetrics();
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch each metric independently
  const fetchMetrics = async () => {
    try {
      // Income Metrics
      const income = await OllamaFTOSReportService.createIncomeMetrics();
      setIncomeMetrics(income);

      // Credit Metrics
      const credit = await OllamaFTOSReportService.createCreditMetrics();
      setCreditMetrics(credit);

      // Cash Flow Metrics
      const cashFlow = await OllamaFTOSReportService.createCashFlowMetrics();
      setCashFlowMetrics(cashFlow);

      // Projection Metrics
      const projection = await OllamaFTOSReportService.createProjectionMetrics();
      setProjectionMetrics(projection);

      // Behavioral Metrics
      const behavioral = await OllamaFTOSReportService.createBehavioralMetrics();
      setBehavioralMetrics(behavioral);

      // Other Metrics
      const other = await OllamaFTOSReportService.createOtherMetrics();
      setOtherMetrics(other);

      // ID Verification
      const userProfile = await fetchUserProfile();
      setIdVerification({
        name: userProfile.personal_info.name,
        icNo: userProfile.personal_info.identity_no,
        address: userProfile.personal_info.address,
        occupation: userProfile.personal_info.occupation,
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[40px] w-[400px]" /> {/* For tabs */}
        <Skeleton className="h-[500px] w-full" /> {/* For content */}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const reportData = {
    income_metrics: incomeMetrics,
    credit_metrics: creditMetrics,
    cash_flow_metrics: cashFlowMetrics,
    projection_metrics: projectionMetrics,
    behavioral_metrics: behavioralMetrics,
    other_metrics: otherMetrics,
    id_verification: idVerification,
  };

  if (
    !reportData.income_metrics ||
    !reportData.credit_metrics ||
    !reportData.cash_flow_metrics ||
    !reportData.projection_metrics
  ) {
    return (
      <Alert>
        <AlertDescription>
          No report data available. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Calculate risk level based on various metrics
  const calculateRiskLevel = () => {
    const { credit_metrics, cash_flow_metrics } = reportData;
    if (credit_metrics.score >= 750 && cash_flow_metrics.monthly_net_flow > 0)
      return "low";
    if (credit_metrics.score >= 650 && cash_flow_metrics.monthly_net_flow >= 0)
      return "medium";
    return "high";
  };

  // Generate summary based on metrics
  const generateSummary = () => {
    const { income_metrics, credit_metrics, cash_flow_metrics } = reportData;
    return `Your financial health shows ${
      income_metrics.stability_score > 0.7 ? "stable" : "variable"
    } income with a credit score of ${
      credit_metrics.score
    }. Monthly cash flow is ${
      cash_flow_metrics.monthly_net_flow >= 0 ? "positive" : "negative"
    } at $${Math.abs(cash_flow_metrics.monthly_net_flow).toFixed(2)}.`;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <IDVerification data={reportData.id_verification} />
        <FtosReportSummary
          summary={generateSummary()}
          recommendations={reportData.credit_metrics.recommendations}
          creditScore={reportData.credit_metrics.score}
          riskLevel={calculateRiskLevel()}
        />
      </div>

      <Card className="p-6">
        <Tabs defaultValue="income" className="space-y-4">
          <TabsList>
            <TabsTrigger value="income">Income Assessment</TabsTrigger>
            <TabsTrigger value="credit">Credit History</TabsTrigger>
            <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
            <TabsTrigger value="projections">Future Projections</TabsTrigger>
            <TabsTrigger value="behavioral">Behavioral Metrics</TabsTrigger>
            <TabsTrigger value="other">Other Metrics</TabsTrigger>
          </TabsList>
          <TabsContent value="income" className="space-y-4">
            <IncomeAssessment metrics={reportData.income_metrics} />
          </TabsContent>
          <TabsContent value="credit" className="space-y-4">
            <CreditHistoryEvaluation
              creditScore={reportData.credit_metrics.score}
              paymentHistory={reportData.credit_metrics.payment_history}
              creditUtilization={reportData.credit_metrics.credit_utilization}
              recommendations={reportData.credit_metrics.recommendations}
            />
          </TabsContent>
          <TabsContent value="cashflow" className="space-y-4">
            <CashFlowAnalysis metrics={reportData.cash_flow_metrics} />
          </TabsContent>
          <TabsContent value="projections" className="space-y-4">
            <FutureProjections metrics={reportData.projection_metrics} />
          </TabsContent>
          <TabsContent value="behavioral" className="space-y-4">
            <BehavioralFinancialMetrics
              metrics={reportData.behavioral_metrics}
            />
          </TabsContent>
          <TabsContent value="other" className="space-y-4">
            <OtherFinancialMetrics metrics={reportData.other_metrics} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
