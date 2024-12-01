import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FtosReportSummaryProps {
  summary: string;
  recommendations: string[];
  creditScore: number;
  riskLevel: "low" | "medium" | "high";
}

export default function FtosReportSummary({
  summary,
  recommendations,
  creditScore,
  riskLevel,
}: FtosReportSummaryProps) {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "high":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return "bg-green-500";
    if (score >= 670) return "bg-blue-500";
    if (score >= 580) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-full lg:col-span-4">
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
          <CardDescription>AI-Generated Financial Health Overview</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
          
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Key Recommendations</h4>
            <ul className="space-y-2">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full md:col-span-1 lg:col-span-3">
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
          <CardDescription>Credit Score & Risk Level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Credit Score</span>
                <span className="text-sm font-semibold">{creditScore}</span>
              </div>
              <Progress
                value={(creditScore / 850) * 100}
                className={getCreditScoreColor(creditScore)}
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Poor</span>
                <span>Fair</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Level</h4>
              <div className={`text-lg font-semibold ${getRiskLevelColor(riskLevel)} capitalize`}>
                {riskLevel}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {riskLevel === "low" && "Your financial health indicates a stable and secure position"}
                {riskLevel === "medium" && "Your financial health shows some areas for improvement"}
                {riskLevel === "high" && "Your financial health requires immediate attention"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
