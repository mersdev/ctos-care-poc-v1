export interface IncomeMetrics {
  monthly_average: number;
  stability_score: number;
  growth_rate: number;
  sources: { [key: string]: number };
}

export interface CreditMetrics {
  score: number;
  payment_history: string;
  credit_utilization: string;
  recommendations: string[];
}

export interface CashFlowMetrics {
  monthly_net_flow: number;
  volatility: number;
  seasonal_patterns: boolean;
  emergency_fund_months: number;
}

export interface ProjectionMetrics {
  projected_income_6m: number[];
  growth_rate_6m: number[];
  confidence_score: number;
  risk_factors: string[];
  opportunities: string[];
}

export interface IDVerificationData {
  name?: string;
  icNo?: string;
  dob?: string;
  nationality?: string;
  address?: string;
  occupation?: string;
}

export interface BehavioralMetrics {
  spendingData: Array<{
    month: string;
    essentials: number;
    nonEssentials: number;
  }>;
  insights: {
    patterns: string[];
    stressIndicators: string[];
  };
}

export interface OtherMetrics {
  economicIndicators: {
    industryGrowth: number;
    economicCorrelation: number;
    policyImpact: string[];
  };
  professionalDevelopment: {
    skillsGrowth: string[];
  };
}

export interface FTOSAnalysis {
  income_metrics: IncomeMetrics;
  credit_metrics: CreditMetrics;
  cash_flow_metrics: CashFlowMetrics;
  projection_metrics: ProjectionMetrics;
  id_verification?: IDVerificationData;
  behavioral_metrics?: BehavioralMetrics;
  other_metrics?: OtherMetrics;
}
