import { fetchTransactions, fetchUserProfile } from "@/api/ftosReportApi";
import { fetchJobMarketData } from "@/api/jobMarketApi";
import {
  BehavioralMetrics,
  CashFlowMetrics,
  CreditMetrics,
  IncomeMetrics,
  OtherMetrics,
  ProjectionMetrics,
} from "@/types/ftos";
import axios from "axios";

// Configure axios defaults
const ollamaApi = axios.create({
  baseURL: "http://localhost:11434",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Increased to 60 second timeout
});

export class OllamaFTOSReportService {
  private static cleanJsonString(str: string): string {
    try {
      // Remove any text before the first '[' or '{'
      const startBracket = str.indexOf('[');
      const startBrace = str.indexOf('{');
      const startIndex = startBracket !== -1 && startBrace !== -1 
        ? Math.min(startBracket, startBrace)
        : Math.max(startBracket, startBrace);
      
      if (startIndex === -1) return str;
      str = str.substring(startIndex);

      // Remove any text after the matching closing bracket/brace
      let depth = 0;
      let endIndex = -1;
      const chars = str.split('');
      
      for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '[' || chars[i] === '{') depth++;
        if (chars[i] === ']' || chars[i] === '}') depth--;
        if (depth === 0) {
          endIndex = i;
          break;
        }
      }

      if (endIndex !== -1) {
        str = str.substring(0, endIndex + 1);
      }

      // Remove escaped characters and fix common JSON issues
      str = str
        .replace(/\\n/g, ' ')          // Replace escaped newlines
        .replace(/\\r/g, ' ')          // Replace escaped carriage returns
        .replace(/\\t/g, ' ')          // Replace escaped tabs
        .replace(/\\\\/g, '\\')        // Fix double escaped backslashes
        .replace(/\\"/g, '"')          // Fix escaped quotes
        .replace(/"{/g, '{')           // Remove quotes around objects
        .replace(/}"/g, '}')           // Remove quotes around objects
        .replace(/"\[/g, '[')          // Remove quotes around arrays
        .replace(/\]"/g, ']')          // Remove quotes around arrays
        .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes to unquoted keys
        .replace(/\s+/g, ' ')          // Replace multiple spaces with single space
        .trim();                       // Trim whitespace

      return str;
    } catch (error) {
      console.error("Error cleaning JSON string:", error);
      return str;
    }
  }

  private static parseOllamaResponse(response: any): any {
    try {
      // First, check if response.data is an object with a 'response' field
      const rawResponse = response.data?.response || response.data;
      console.log("Raw Response:", rawResponse);

      if (typeof rawResponse !== 'string') {
        return rawResponse;
      }

      // Clean the response string
      const cleanedResponse = this.cleanJsonString(rawResponse);
      console.log("Cleaned Response:", cleanedResponse);

      // Try to parse as is first
      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.log("Initial parse failed, trying to extract JSON pattern");
        
        // Try to extract JSON array or object pattern
        const arrayMatch = cleanedResponse.match(/\[([\s\S]*?)\]/);
        const objectMatch = cleanedResponse.match(/\{([\s\S]*?)\}/);
        
        if (arrayMatch) {
          const arrayStr = `[${arrayMatch[1]}]`;
          console.log("Extracted array:", arrayStr);
          return JSON.parse(arrayStr);
        }
        
        if (objectMatch) {
          const objectStr = `{${objectMatch[1]}}`;
          console.log("Extracted object:", objectStr);
          return JSON.parse(objectStr);
        }

        // If no JSON structure found, try to create an array from the response
        const lines = cleanedResponse
          .split(/[.,\n]/)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map(line => `"${line.replace(/"/g, '\\"')}"`);

        if (lines.length > 0) {
          const arrayStr = `[${lines.join(',')}]`;
          console.log("Created array from lines:", arrayStr);
          return JSON.parse(arrayStr);
        }

        throw new Error('No valid JSON structure found in response');
      }
    } catch (error) {
      console.error("Error parsing response:", error);
      throw error;
    }
  }

  static async createIncomeMetrics(): Promise<IncomeMetrics> {
    const data = await fetchTransactions();

    // Filter only income transactions (credit type)
    const incomeTransactions = data.filter((t) => t.type === "credit");

    // Calculate monthly average
    const monthly_average =
      incomeTransactions.reduce(
        (total, transaction) => total + transaction.amount,
        0
      ) / incomeTransactions.length;

    // Calculate stability score (0-100)
    // Based on the standard deviation of income amounts
    const amounts = incomeTransactions.map((t) => t.amount);
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const stability_score = Math.max(
      0,
      Math.min(100, 100 - (stdDev / mean) * 100)
    );

    // Calculate growth rate
    // Sort transactions by date and compare first and last month averages
    const sortedTransactions = [...incomeTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstMonthAvg =
      sortedTransactions
        .slice(0, Math.ceil(sortedTransactions.length / 6))
        .reduce((sum, t) => sum + t.amount, 0) /
      Math.ceil(sortedTransactions.length / 6);
    const lastMonthAvg =
      sortedTransactions
        .slice(-Math.ceil(sortedTransactions.length / 6))
        .reduce((sum, t) => sum + t.amount, 0) /
      Math.ceil(sortedTransactions.length / 6);

    const growth_rate = ((lastMonthAvg - firstMonthAvg) / firstMonthAvg) * 100;

    // Aggregate income sources
    const sources = incomeTransactions.reduce((acc, transaction) => {
      acc[transaction.category] =
        (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as { [key: string]: number });

    return {
      monthly_average,
      stability_score,
      growth_rate,
      sources,
    };
  }

  static async createCreditMetrics(): Promise<CreditMetrics> {
    const transactions = await fetchTransactions();
    const userProfile = await fetchUserProfile();

    // Calculate payment history
    const totalTransactions = transactions.length;
    const latePayments = transactions.filter(
      (t) => t.type === "debit" && new Date(t.date) > new Date(t.date)
    ).length;
    const paymentHistoryScore =
      ((totalTransactions - latePayments) / totalTransactions) * 100;
    const paymentHistory = `${paymentHistoryScore.toFixed(
      1
    )}% on-time payments`;

    // Calculate credit utilization
    const totalCredit = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const utilizationRate = (totalDebit / totalCredit) * 100;
    const creditUtilization = `${utilizationRate.toFixed(1)}% utilization rate`;

    // Calculate overall credit score (300-850 range)
    const score = Math.min(
      850,
      300 +
        paymentHistoryScore * 3.5 + // Payment history (35%)
        (100 - utilizationRate) * 3 // Credit utilization (30%)
    );

    // Generate recommendations
    const response = await ollamaApi.post("/api/generate", {
      model: "llama3",
      prompt: `Analyze the credit profile for ${userProfile.personal_info.name}:
    
Credit Profile Metrics:
- Payment History Score: ${paymentHistoryScore.toFixed(1)}%
- Credit Utilization Rate: ${utilizationRate.toFixed(1)}%
- Credit History Length: ${transactions.length} transactions

Context:
- Good payment history is above 95%
- Healthy credit utilization is below 30%
- Strong credit history typically has 12+ months of transactions

Based on these metrics, generate a personalized list of 3-5 specific recommendations to improve their credit health. Consider:
1. If payment history is below 95%, suggest specific payment management strategies
2. If utilization is above 30%, provide actionable steps to reduce it
3. If credit history is short, recommend ways to build credit responsibly
4. Include specific tips based on their occupation as ${
        userProfile.personal_info.occupation
      }

Return ONLY a JSON array of strings, with each string being a specific recommendation.
Example format:
[
  "Set up automatic payments for all recurring bills to ensure timely payments",
  "Consider requesting a credit limit increase to reduce utilization rate",
  "Maintain consistent credit activity by using credit card for regular expenses"
]`,
      stream: false,
    });

    console.log("Credit Metrics - Raw Ollama Response:", response.data);

    let recommendations: string[] = [];
    try {
      const parsedResponse = this.parseOllamaResponse(response);
      console.log("Credit Metrics - Parsed Response:", parsedResponse);

      // Ensure we have an array of strings
      if (Array.isArray(parsedResponse)) {
        recommendations = parsedResponse.map(
          (item: unknown) => item?.toString().trim() || ""
        );
      } else {
        throw new Error("Response is not an array");
      }

      console.log("Credit Metrics - Final Recommendations:", recommendations);
    } catch (error) {
      console.error("Error parsing credit recommendations:", error);
      recommendations = [
        "Set up automatic payments to improve payment history",
        "Consider reducing credit utilization to below 30%",
        "Build credit history by maintaining regular credit activity",
      ];
      console.log(
        "Credit Metrics - Using fallback recommendations:",
        recommendations
      );
    }

    return {
      score: Math.round(score),
      payment_history: paymentHistory,
      credit_utilization: creditUtilization,
      recommendations,
    };
  }

  static async createCashFlowMetrics(): Promise<CashFlowMetrics> {
    const transactions = await fetchTransactions();

    // Calculate monthly net flow
    const monthlyFlows = new Map<string, number>();
    transactions.forEach((t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      const amount = t.type === "credit" ? t.amount : -t.amount;
      monthlyFlows.set(month, (monthlyFlows.get(month) || 0) + amount);
    });
    const monthly_net_flow =
      Array.from(monthlyFlows.values()).reduce((sum, flow) => sum + flow, 0) /
      monthlyFlows.size;

    // Calculate volatility (standard deviation of monthly flows)
    const mean = monthly_net_flow;
    const squaredDiffs = Array.from(monthlyFlows.values()).map((flow) =>
      Math.pow(flow - mean, 2)
    );
    const volatility = Math.sqrt(
      squaredDiffs.reduce((sum, diff) => sum + diff, 0) / monthlyFlows.size
    );

    // Detect seasonal patterns by comparing monthly flows
    const monthlyAverages = new Map<number, number>();
    Array.from(monthlyFlows.entries()).forEach(([month, flow]) => {
      const monthNum = parseInt(month.split("-")[1]);
      monthlyAverages.set(
        monthNum,
        (monthlyAverages.get(monthNum) || 0) + flow
      );
    });
    const seasonal_patterns =
      Math.max(...Array.from(monthlyAverages.values())) /
        Math.min(...Array.from(monthlyAverages.values())) >
      1.5;

    // Calculate emergency fund months (based on average monthly expenses)
    const monthlyExpenses = new Map<string, number>();
    transactions
      .filter((t) => t.type === "debit")
      .forEach((t) => {
        const month = t.date.substring(0, 7);
        monthlyExpenses.set(
          month,
          (monthlyExpenses.get(month) || 0) + Math.abs(t.amount)
        );
      });
    const avgMonthlyExpense =
      Array.from(monthlyExpenses.values()).reduce((sum, exp) => sum + exp, 0) /
      monthlyExpenses.size;
    const totalSavings = transactions.reduce(
      (sum, t) => sum + (t.type === "credit" ? t.amount : -t.amount),
      0
    );
    const emergency_fund_months = totalSavings / avgMonthlyExpense;

    return {
      monthly_net_flow,
      volatility,
      seasonal_patterns,
      emergency_fund_months,
    };
  }

  static async createProjectionMetrics(): Promise<ProjectionMetrics> {
    const transactions = await fetchTransactions();
    const userProfile = await fetchUserProfile();
    const jobMarketData = await fetchJobMarketData();

    // Calculate monthly incomes for the past 6 months
    const monthlyIncomes = new Map<string, number>();
    transactions
      .filter((t) => t.type === "credit")
      .forEach((t) => {
        const month = t.date.substring(0, 7);
        monthlyIncomes.set(month, (monthlyIncomes.get(month) || 0) + t.amount);
      });

    // Sort monthly incomes by date
    const sortedIncomes = Array.from(monthlyIncomes.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, amount]) => amount);

    // Calculate month-over-month growth rates
    const growthRates = [];
    for (let i = 1; i < sortedIncomes.length; i++) {
      const rate =
        (sortedIncomes[i] - sortedIncomes[i - 1]) / sortedIncomes[i - 1];
      growthRates.push(rate);
    }

    // Project next 6 months using average growth rate
    const avgGrowthRate =
      growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
    const lastIncome = sortedIncomes[sortedIncomes.length - 1];
    const projected_income_6m = Array(6)
      .fill(0)
      .map((_, i) => lastIncome * Math.pow(1 + avgGrowthRate, i + 1));
    const growth_rate_6m = Array(6).fill(avgGrowthRate);

    // Use Ollama to analyze projections and generate insights
    const response = await ollamaApi.post("/api/generate", {
      model: "llama3",
      prompt: `Analyze the following financial data for ${
        userProfile.personal_info.name
      }, occupation: ${userProfile.personal_info.occupation}
  
  Historical Data:
  - Monthly Incomes (last 6 months): ${JSON.stringify(sortedIncomes)}
  - Average Monthly Growth Rate: ${(avgGrowthRate * 100).toFixed(1)}%
  
  Job Market Context:
  ${JSON.stringify(jobMarketData, null, 2)}
  
  Based on this data, provide:
  1. A confidence score (0-100) for the income projections
  2. Key risk factors that could affect future income
  3. Potential opportunities for income growth
  
  Format the response as a JSON object with these exact keys:
  {
    "confidence_score": number,
    "risk_factors": string[],
    "opportunities": string[]
  }`,
      stream: false,
    });

    console.log("Projection Metrics - Raw Ollama Response:", response.data);

    let risk_factors: string[] = [];
    let opportunities: string[] = [];
    let confidence_score = 70;

    try {
      const parsedResponse = this.parseOllamaResponse(response);
      console.log("Projection Metrics - Parsed Response:", parsedResponse);

      // Handle both array and object responses
      if (Array.isArray(parsedResponse)) {
        // If it's an array, split it between risk factors and opportunities
        const midPoint = Math.floor(parsedResponse.length / 2);
        risk_factors = parsedResponse
          .slice(0, midPoint)
          .map((item: unknown) => item?.toString().trim() || "");
        opportunities = parsedResponse
          .slice(midPoint)
          .map((item: unknown) => item?.toString().trim() || "");
      } else if (
        typeof parsedResponse === "object" &&
        parsedResponse !== null
      ) {
        // If it's an object, extract the fields
        risk_factors = Array.isArray(parsedResponse.risk_factors)
          ? parsedResponse.risk_factors.map(
              (item: unknown) => item?.toString().trim() || ""
            )
          : [];
        opportunities = Array.isArray(parsedResponse.opportunities)
          ? parsedResponse.opportunities.map(
              (item: unknown) => item?.toString().trim() || ""
            )
          : [];
        confidence_score = parsedResponse.confidence_score || 70;
      } else {
        throw new Error("Response is neither an array nor an object");
      }

      console.log("Projection Metrics - Final Analysis:", {
        risk_factors,
        opportunities,
        confidence_score,
      });
    } catch (error) {
      console.error("Error parsing projection analysis:", error);
      risk_factors = [
        "Market volatility",
        "Industry changes",
        "Economic conditions",
      ];
      opportunities = [
        "Skill development",
        "Market expansion",
        "Network growth",
      ];
      console.log("Projection Metrics - Using fallback analysis:", {
        risk_factors,
        opportunities,
        confidence_score,
      });
    }

    return {
      projected_income_6m,
      growth_rate_6m,
      confidence_score,
      risk_factors,
      opportunities,
    };
  }

  static async createBehavioralMetrics(): Promise<BehavioralMetrics> {
    const transactions = await fetchTransactions();

    // Group transactions by month and category
    const monthlyData = new Map<
      string,
      { essentials: number; nonEssentials: number }
    >();

    // Define essential categories
    const essentialCategories = new Set([
      "groceries",
      "utilities",
      "rent",
      "transportation",
      "healthcare",
    ]);

    // Process transactions
    transactions.forEach((transaction) => {
      const month = transaction.date.substring(0, 7); // Get YYYY-MM format
      const amount = Math.abs(transaction.amount);
      const isEssential = essentialCategories.has(
        transaction.category.toLowerCase()
      );

      if (!monthlyData.has(month)) {
        monthlyData.set(month, { essentials: 0, nonEssentials: 0 });
      }

      const data = monthlyData.get(month)!;
      if (isEssential) {
        data.essentials += amount;
      } else {
        data.nonEssentials += amount;
      }
    });

    // Convert to array and sort by month
    const spendingData = Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        essentials: data.essentials,
        nonEssentials: data.nonEssentials,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Generate insights using Ollama
    const response = await ollamaApi.post("/api/generate", {
      model: "llama3",
      prompt: `Analyze the spending patterns and generate behavioral insights:

Spending Data:
${JSON.stringify(spendingData, null, 2)}

Generate:
1. Key spending patterns (3-5 observations)
2. Financial stress indicators (2-3 points)

Return as a JSON object with these exact keys:
{
  "patterns": string[],
  "stressIndicators": string[]
}`,
      stream: false,
    });

    console.log("Behavioral Metrics - Raw Ollama Response:", response.data);

    let patterns: string[] = [];
    let stressIndicators: string[] = [];

    try {
      const parsedResponse = this.parseOllamaResponse(response);
      console.log("Behavioral Metrics - Parsed Response:", parsedResponse);

      // Handle both array and object responses
      if (Array.isArray(parsedResponse)) {
        // If it's an array, split it between patterns and stress indicators
        const midPoint = Math.floor(parsedResponse.length / 2);
        patterns = parsedResponse
          .slice(0, midPoint)
          .map((item: unknown) => item?.toString().trim() || "");
        stressIndicators = parsedResponse
          .slice(midPoint)
          .map((item: unknown) => item?.toString().trim() || "");
      } else if (
        typeof parsedResponse === "object" &&
        parsedResponse !== null
      ) {
        // If it's an object, extract the fields
        patterns = Array.isArray(parsedResponse.patterns)
          ? parsedResponse.patterns.map(
              (item: unknown) => item?.toString().trim() || ""
            )
          : [];
        stressIndicators = Array.isArray(parsedResponse.stressIndicators)
          ? parsedResponse.stressIndicators.map(
              (item: unknown) => item?.toString().trim() || ""
            )
          : [];
      } else {
        throw new Error("Response is neither an array nor an object");
      }

      console.log("Behavioral Metrics - Final Insights:", {
        patterns,
        stressIndicators,
      });
    } catch (error) {
      console.error("Error parsing behavioral insights:", error);
      patterns = [
        "Consistent essential spending",
        "Variable discretionary spending",
        "Monthly budget adherence",
      ];
      stressIndicators = [
        "High essential to discretionary ratio",
        "Increasing debt levels",
      ];
      console.log("Behavioral Metrics - Using fallback insights:", {
        patterns,
        stressIndicators,
      });
    }

    return {
      spendingData,
      insights: {
        patterns,
        stressIndicators,
      },
    };
  }

  static async createOtherMetrics(): Promise<OtherMetrics> {
    //TODO: Calculate other metrics using Ollama and Job Market Data
    const jobMarketData = await fetchJobMarketData();
    const profileData = await fetchUserProfile();
    const jobTrendyNews = await this.searchOccupationInfo(
      profileData.personal_info.occupation
    );

    const response = await ollamaApi.post("/api/generate", {
      model: "llama3",
      prompt: `Analyze the following job market data and news for ${
        profileData.personal_info.occupation
      }:

Job Market Data:
${JSON.stringify(jobMarketData, null, 2)}

Related Government Policy News:
${jobTrendyNews}

Generate a structured analysis with exactly these metrics:
1. Industry Growth Rate (as a decimal between 0 and 1)
2. Economic Correlation (as a decimal between -1 and 1)
3. List of Policy Impact Statements

Format the response as a JSON object with these exact keys:
{
  "industryGrowth": number,
  "economicCorrelation": number,
  "policyImpact": string[]
}`,
      stream: false,
    });

    console.log("Other Metrics - Raw Ollama Response:", response.data);

    let policyImpact: string[] = [];
    let industryGrowth = 0.5;
    let economicCorrelation = 0.2;

    try {
      const parsedResponse = this.parseOllamaResponse(response);
      console.log("Other Metrics - Parsed Response:", parsedResponse);

      // Handle both array and object responses
      if (Array.isArray(parsedResponse)) {
        policyImpact = parsedResponse.map(
          (item: unknown) => item?.toString().trim() || ""
        );
      } else if (
        typeof parsedResponse === "object" &&
        parsedResponse !== null
      ) {
        industryGrowth = parsedResponse.industryGrowth || 0.5;
        economicCorrelation = parsedResponse.economicCorrelation || 0.2;
        policyImpact = Array.isArray(parsedResponse.policyImpact)
          ? parsedResponse.policyImpact.map(
              (item: unknown) => item?.toString().trim() || ""
            )
          : [
              "Industry growth rate is moderate",
              "Economic correlation is low",
              "Policy impact is minimal",
            ];
      } else {
        throw new Error("Response is neither an array nor an object");
      }

      console.log("Other Metrics - Final Analysis:", {
        industryGrowth,
        economicCorrelation,
        policyImpact,
      });
    } catch (error) {
      console.error("Error parsing other metrics:", error);
      policyImpact = [
        "Industry growth rate is moderate",
        "Economic correlation is low",
        "Policy impact is minimal",
      ];
      console.log("Other Metrics - Using fallback values:", {
        industryGrowth,
        economicCorrelation,
        policyImpact,
      });
    }

    return {
      economicIndicators: {
        industryGrowth,
        economicCorrelation,
        policyImpact,
      },
      professionalDevelopment: {
        skillsGrowth: profileData.trainings.map((training) => training.name),
      },
    };
  }

  private static async searchOccupationInfo(
    occupation: string
  ): Promise<string> {
    try {
      const response = await axios.get("https://api.duckduckgo.com/", {
        params: {
          q: `${occupation} related with Malaysian Government Policy`,
          format: "json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching company info:", error);
      return "";
    }
  }
}
