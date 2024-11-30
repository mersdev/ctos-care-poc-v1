import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EconomicIndicators {
  industryGrowth: number;
  economicCorrelation: number;
  policyImpact: string[];
}

interface OtherFinancialMetricsProps {
  metrics?: {
    economicIndicators: EconomicIndicators;
    professionalDevelopment: {
      skillsGrowth: string[];
    };
  };
}

export default function OtherFinancialMetrics({
  metrics,
}: OtherFinancialMetricsProps) {
  if (!metrics) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Additional Financial Metrics</CardTitle>
            <CardDescription>No additional metrics available</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              Additional metrics are not available at this time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { economicIndicators, professionalDevelopment } = metrics;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Additional Financial Metrics</CardTitle>
          <CardDescription>
            Other important indicators of your financial health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold">Industry Growth Rate</h3>
              <p className="text-2xl font-bold">
                {economicIndicators.industryGrowth}% annually
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Professional Development Skills
              </h3>
              <p className="text-2xl font-bold">
                ${professionalDevelopment.skillsGrowth}{" "}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industry-Specific Economic Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Economic Correlation
              </h3>
              <p className="text-gray-700">
                Your income shows a{" "}
                {economicIndicators.economicCorrelation >= 0.7
                  ? "strong"
                  : economicIndicators.economicCorrelation >= 0.4
                  ? "moderate"
                  : "weak"}{" "}
                correlation ({economicIndicators.economicCorrelation.toFixed(2)}
                ) with overall economic growth.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Development</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Skills Growth</h3>
              <ul className="list-disc pl-5 space-y-1">
                {professionalDevelopment.skillsGrowth.map((skill, index) => (
                  <li key={index} className="text-gray-700">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Government Policies Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1">
            {economicIndicators.policyImpact.map((impact, index) => (
              <li key={index} className="text-gray-700">
                {impact}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
