import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CashFlowMetrics {
  monthly_net_flow: number;
  volatility: number;
  seasonal_patterns: boolean;
  emergency_fund_months: number;
}

interface CashFlowAnalysisProps {
  metrics?: CashFlowMetrics;
}

export default function CashFlowAnalysis({ metrics }: CashFlowAnalysisProps) {
  if (!metrics) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">No cash flow data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    monthly_net_flow,
    volatility,
    seasonal_patterns,
    emergency_fund_months,
  } = metrics;

  const getVolatilityLabel = (vol: number) => {
    if (vol <= 0.1) return "Very Stable";
    if (vol <= 0.2) return "Stable";
    if (vol <= 0.3) return "Moderate";
    if (vol <= 0.4) return "Volatile";
    return "Highly Volatile";
  };

  const getEmergencyFundStatus = (months: number) => {
    if (months >= 6) return { label: "Excellent", color: "text-green-600" };
    if (months >= 3) return { label: "Good", color: "text-blue-600" };
    if (months >= 1) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Needs Attention", color: "text-red-600" };
  };

  const emergencyFundStatus = getEmergencyFundStatus(emergency_fund_months);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Overview</CardTitle>
          <CardDescription>
            Monthly cash flow metrics and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Monthly Net Flow</h3>
              <p
                className={`text-2xl font-bold ${
                  monthly_net_flow >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${monthly_net_flow.toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Cash Flow Volatility</h3>
              <p className="text-2xl font-bold">
                {getVolatilityLabel(volatility)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Seasonal Patterns</h3>
              <p className="text-2xl font-bold">
                {seasonal_patterns ? "Present" : "Not Present"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Emergency Fund</h3>
              <p className={`text-2xl font-bold ${emergencyFundStatus.color}`}>
                {emergency_fund_months.toFixed(1)} months (
                {emergencyFundStatus.label})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
          <CardDescription>
            Detailed analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Monthly Cash Flow</h3>
              <p>
                Your monthly net cash flow is{" "}
                {monthly_net_flow >= 0 ? "positive" : "negative"} at $
                {Math.abs(monthly_net_flow).toFixed(2)}. This indicates{" "}
                {monthly_net_flow >= 0
                  ? "healthy financial management"
                  : "potential financial stress"}
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Volatility Assessment
              </h3>
              <p>
                Your cash flow volatility is{" "}
                {getVolatilityLabel(volatility).toLowerCase()}, which{" "}
                {volatility <= 0.2
                  ? "suggests good financial stability"
                  : "may indicate need for better income stabilization"}
                .
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Seasonal Patterns</h3>
              <p>
                {seasonal_patterns
                  ? "Your income shows seasonal patterns. Consider building additional reserves for lower-income periods."
                  : "Your income is relatively consistent throughout the year, which is beneficial for financial planning."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Emergency Fund Status
              </h3>
              <p>
                Your emergency fund covers {emergency_fund_months.toFixed(1)}{" "}
                months of expenses, which is
                {emergency_fund_months >= 6
                  ? " excellent! This provides a strong financial safety net."
                  : emergency_fund_months >= 3
                  ? " good, but consider building it up to 6 months for better security."
                  : " below recommended levels. Prioritize building this up to at least 3-6 months of expenses."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
