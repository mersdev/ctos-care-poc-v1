import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SpendingData {
  month: string;
  essentials: number;
  nonEssentials: number;
}

interface BehavioralMetrics {
  spendingData: SpendingData[];
  insights: {
    patterns: string[];
    stressIndicators: string[];
  };
}

interface BehavioralFinancialMetricsProps {
  metrics?: BehavioralMetrics;
}

export default function BehavioralFinancialMetrics({ metrics }: BehavioralFinancialMetricsProps) {
  if (!metrics) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Spending Behavior Analysis</CardTitle>
            <CardDescription>No behavioral data available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Behavioral financial metrics are not available at this time.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { spendingData, insights } = metrics;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Spending Behavior Analysis</CardTitle>
          <CardDescription>Your spending patterns and potential financial stress indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={spendingData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="essentials" 
                stroke="#0ea5e9" 
                name="Essential Spending"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="nonEssentials" 
                stroke="#f43f5e" 
                name="Non-Essential Spending"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Spending Behavior Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Spending Patterns</h3>
              <ul className="list-disc pl-5 space-y-1">
                {insights.patterns.map((pattern, index) => (
                  <li key={index}>{pattern}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Financial Stress Indicators</h3>
              <ul className="list-disc pl-5 space-y-1">
                {insights.stressIndicators.map((indicator, index) => (
                  <li key={index} className="text-red-600">{indicator}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
