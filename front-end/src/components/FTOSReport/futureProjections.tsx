import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProjectionMetrics } from "@/types/ftos";

interface ProjectionData {
  month: string;
  projected: number;
}

interface FutureProjectionsProps {
  metrics: ProjectionMetrics;
}

export default function FutureProjections({ metrics }: FutureProjectionsProps) {
  const {
    projected_income_6m,
    growth_rate_6m,
    confidence_score,
    risk_factors,
    opportunities,
  } = metrics;

  // Generate 6-month projection data
  const projectionData: ProjectionData[] = Array.from({ length: 6 }).map(
    (_, i) => {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() + i);
      return {
        month: monthDate.toLocaleString("default", { month: "short" }),
        projected:
          projected_income_6m[i] * Math.pow(1 + growth_rate_6m[i], i / 12),
      };
    }
  );

  const getConfidenceLabel = (score: number) => {
    if (score >= 0.8) return { label: "Very High", color: "text-green-600" };
    if (score >= 0.6) return { label: "High", color: "text-blue-600" };
    if (score >= 0.4) return { label: "Moderate", color: "text-yellow-600" };
    return { label: "Low", color: "text-red-600" };
  };

  const confidenceStatus = getConfidenceLabel(confidence_score);

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>6-Month Financial Projections</CardTitle>
          <CardDescription>
            Projected income and growth analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div>
              <h3 className="text-lg font-semibold">
                Projected Monthly Income
              </h3>
              <p className="text-2xl font-bold">
                ${projected_income_6m[5].toFixed(2)}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Monthly Growth Rate</h3>
              <p className="text-2xl font-bold">
                {(growth_rate_6m[5] * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Confidence Score</h3>
              <p className={`text-2xl font-bold ${confidenceStatus.color}`}>
                {confidenceStatus.label} ({(confidence_score * 100).toFixed(0)}
                %)
              </p>
            </div>
          </div>

          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  name="Projected Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
              <ul className="list-disc pl-5 space-y-1">
                {risk_factors.map((risk, index) => (
                  <li key={index} className="text-red-600">
                    {risk}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Growth Opportunities
              </h3>
              <ul className="list-disc pl-5 space-y-1">
                {opportunities.map((opportunity, index) => (
                  <li key={index} className="text-green-600">
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
