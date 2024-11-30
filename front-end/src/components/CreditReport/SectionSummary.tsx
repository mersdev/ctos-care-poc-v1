import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SectionSummaryProps {
  title: string;
  data: Record<string, string>;
  insights?: {
    score: number;
    trend: "up" | "down" | "stable";
    analysis: string;
    recommendations: string[];
  };
}

const SectionSummary: React.FC<SectionSummaryProps> = ({
  title,
  data = {},
  insights,
}) => {
  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "stable":
        return "text-yellow-500";
      default:
        return "";
    }
  };

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "→";
      default:
        return "";
    }
  };

  const formatRecommendation = (text: string) => {
    // Remove "Expected Impact:" from the text
    return text.replace(/Expected Impact:\s*/g, "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {/* Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {key}
                </p>
                <p className="font-medium">{value}</p>
              </div>
            ))}
          </div>

          {/* AI Insights Section */}
          {insights && (
            <div className="space-y-4 mt-4 border-t pt-4">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">Credit Score Analysis</h4>
                <span className={getTrendColor(insights.trend)}>
                  {getTrendIcon(insights.trend)}
                </span>
              </div>

              {/* Analysis Text */}
              <p className="text-sm text-muted-foreground">
                {insights.analysis}
              </p>

              {/* Recommendations List */}
              {insights.recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  {insights.recommendations[0].startsWith("Based on") ? (
                    <p className="text-sm text-muted-foreground mb-2">
                      {insights.recommendations[0]}
                    </p>
                  ) : null}
                  <ul className="list-disc pl-5 space-y-2">
                    {insights.recommendations
                      .slice(
                        insights.recommendations[0].startsWith("Based on")
                          ? 1
                          : 0
                      )
                      .map((recommendation, index) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground"
                        >
                          {formatRecommendation(recommendation)}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionSummary;
