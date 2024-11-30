import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CreditHistoryEvaluationProps {
  creditScore: number;
  paymentHistory: string;
  creditUtilization: string;
  recommendations: string[];
}

const creditScoreData = [
  { name: "Payment History", value: 35 },
  { name: "Credit Utilization", value: 30 },
  { name: "Length of Credit History", value: 15 },
  { name: "Types of Credit", value: 10 },
  { name: "New Credit", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function CreditHistoryEvaluation({
  creditScore,
  paymentHistory = "Good",
  creditUtilization = "Low",
  recommendations = []
}: CreditHistoryEvaluationProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Credit Score Overview</CardTitle>
          <CardDescription>
            Your credit score breakdown and analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Credit Score</h3>
              <p className="text-2xl font-bold">{creditScore} (Good)</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Payment History</h3>
              <p className="text-2xl font-bold">{paymentHistory}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Credit Utilization</h3>
              <p className="text-2xl font-bold">{creditUtilization}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={creditScoreData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {creditScoreData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
