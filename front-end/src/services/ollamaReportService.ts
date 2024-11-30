import axios from "axios";
import companyData from "../mock/company.json";
import { fetchCreditReportData } from "@/api/creditReportApi";
import type {
  CreditReportData,
  CTOSScore,
  BankingPaymentHistory,
  DirectorshipBusinessInterest,
  TradeReferee,
  LegalCase,
} from "@/types/creditReport";

interface CreditAnalysis {
  score: number;
  confidence: number;
  factors: string[];
  recommendations: string[];
  summary?: string;
  creditScore?: CTOSScore;
  bankingHistory?: BankingPaymentHistory;
  businessInterests?: DirectorshipBusinessInterest[];
  tradeReferences?: TradeReferee[];
  legalStatus?: {
    asPlaintiff: LegalCase[];
    asDefendant: LegalCase[];
  };
}

interface CompanyResearch {
  name: string;
  summary: string;
  riskLevel: "low" | "medium" | "high";
  industryAnalysis: string;
  financialHealth: string;
  reputationScore: number;
}

export class OllamaReportService {
  private static readonly OLLAMA_API = import.meta.env.VITE_OLLAMA_API_URL;
  private static readonly MODEL = import.meta.env.VITE_OLLAMA_MODEL;

  static async generateCreditReport(): Promise<CreditAnalysis> {
    try {
      const data = await this.fetchDataForAnalysis();

      // Perform comprehensive evaluation
      const transactionConsistency = this.evaluateTransactionConsistency(data);
      const companyDataConsistency = this.evaluateCompanyDataConsistency(data);
      const scoreReasonability = this.evaluateScoreReasonability(data);

      // Calculate overall confidence score
      const confidence =
        (transactionConsistency.confidenceScore +
          companyDataConsistency.confidenceScore +
          scoreReasonability.confidenceScore) /
        3;

      // Generate base score - use CTOS score if available, otherwise calculate
      let score = data.ctosScore?.score || 750;

      // Adjust score based on findings
      if (!transactionConsistency.isConsistent) score -= 50;
      if (!companyDataConsistency.isConsistent) score -= 30;
      if (!scoreReasonability.isReasonable) score -= 40;

      // Ensure score stays within valid range (300-850)
      score = Math.min(Math.max(score, 300), 850);

      // Compile all findings as factors
      const factors = [
        ...transactionConsistency.findings,
        ...companyDataConsistency.findings,
        ...scoreReasonability.findings,
      ].filter(Boolean); // Remove any undefined/null entries

      const summary = await this.generatePersonalizedAnalysisSummary(
        data,
        transactionConsistency,
        companyDataConsistency,
        scoreReasonability,
        score
      );
      // Generate personalized recommendations using LLM
      const recommendations = await this.generatePersonalizedRecommendations(
        data,
        transactionConsistency,
        companyDataConsistency,
        scoreReasonability,
        score
      );

      return {
        score,
        confidence,
        factors,
        summary,
        recommendations,
        creditScore: data.ctosScore,
        bankingHistory: data.bankingPaymentHistory,
        businessInterests: data.directorshipsBusinessInterests,
        tradeReferences: data.tradeReferee,
        legalStatus: data.legalCases,
      };
    } catch (error) {
      console.error("Error generating credit report:", error);
      // Return default analysis with helpful recommendations
      return {
        score: 750,
        confidence: 0.8,
        factors: [
          "Unable to perform detailed analysis",
          "Using default credit assessment",
        ],
        recommendations: [
          "Request a new credit report analysis",
          "Ensure all required data is available",
          "Maintain regular credit monitoring",
        ],
      };
    }
  }

  static async researchCompany(companyName: string): Promise<CompanyResearch> {
    try {
      // Search company using DuckDuckGo
      const searchResults = await this.searchCompanyInfo(companyName);

      // Analyze company data
      const analysis = await this.analyzeCompanyData(
        companyName,
        searchResults
      );

      return analysis;
    } catch (error) {
      console.error("Error researching company:", error);
      throw new Error("Failed to research company");
    }
  }

  private static async fetchDataForAnalysis(): Promise<CreditReportData> {
    try {
      return await fetchCreditReportData();
    } catch (error) {
      console.error("Error fetching credit report data:", error);
      throw error;
    }
  }

  private static evaluateTransactionConsistency(data: CreditReportData): {
    isConsistent: boolean;
    confidenceScore: number;
    findings: string[];
  } {
    const findings: string[] = [];
    let confidenceScore = 1.0;

    // Check banking payment history
    if (data.bankingPaymentHistory?.accounts) {
      const accounts = data.bankingPaymentHistory.accounts;
      let hasInconsistencies = false;

      accounts.forEach((account) => {
        if (
          account.status === "Active" &&
          account.paymentHistory !== "Excellent"
        ) {
          findings.push(
            `Inconsistent payment history found for ${account.bank}`
          );
          hasInconsistencies = true;
          confidenceScore -= 0.1;
        }
      });

      if (!hasInconsistencies) {
        findings.push("Banking payment history shows consistent patterns");
      }
    }

    // Check dishonoured cheques
    if (data.dishonouredCheques && data.dishonouredCheques.length > 0) {
      findings.push(
        "Presence of dishonoured cheques affects transaction consistency"
      );
      confidenceScore -= 0.2;
    }

    // Check legal cases
    if (data.legalCases) {
      const totalCases =
        (data.legalCases.asPlaintiff?.length || 0) +
        (data.legalCases.asDefendant?.length || 0);
      if (totalCases > 0) {
        findings.push("Legal cases present may indicate financial disputes");
        confidenceScore -= 0.15;
      }
    }

    return {
      isConsistent: confidenceScore > 0.7,
      confidenceScore: Math.max(0, confidenceScore),
      findings,
    };
  }

  private static evaluateCompanyDataConsistency(data: CreditReportData): {
    isConsistent: boolean;
    confidenceScore: number;
    findings: string[];
  } {
    const findings: string[] = [];
    let confidenceScore = 1.0;

    // Check directorships and business interests
    if (data.directorshipsBusinessInterests) {
      const businesses = data.directorshipsBusinessInterests;

      businesses.forEach((business) => {
        if (business.status === "Active") {
          findings.push(`Active business interest: ${business.name}`);
        }
      });

      if (businesses.length > 3) {
        findings.push(
          "Multiple business interests indicate complex business relationships"
        );
        confidenceScore -= 0.1;
      }
    }

    // Check trade referees
    if (data.tradeReferee) {
      const referees = data.tradeReferee;
      if (referees.length > 0) {
        findings.push(`${referees.length} trade references found`);

        const goodRatings = referees.filter((ref) => ref.rating === "A").length;
        if (goodRatings === referees.length) {
          findings.push("All trade references show positive ratings");
        } else {
          findings.push("Mixed trade reference ratings present");
          confidenceScore -= 0.15;
        }
      }
    }

    return {
      isConsistent: confidenceScore > 0.7,
      confidenceScore: Math.max(0, confidenceScore),
      findings,
    };
  }

  private static evaluateScoreReasonability(data: CreditReportData): {
    isReasonable: boolean;
    confidenceScore: number;
    findings: string[];
  } {
    const findings: string[] = [];
    let confidenceScore = 1.0;

    // Check CTOS score against other indicators
    if (data.ctosScore) {
      const score = data.ctosScore.score;

      // Check payment history alignment
      if (data.bankingPaymentHistory?.accounts) {
        const paymentHistory = data.bankingPaymentHistory.accounts;
        const allExcellent = paymentHistory.every(
          (acc) => acc.paymentHistory === "Excellent"
        );

        if (score > 700 && !allExcellent) {
          findings.push(
            "High score with mixed payment history requires review"
          );
          confidenceScore -= 0.2;
        }
        if (score < 600 && allExcellent) {
          findings.push(
            "Low score despite good payment history requires investigation"
          );
          confidenceScore -= 0.2;
        }
      }

      // Check legal cases alignment
      if (data.legalCases) {
        const totalCases =
          (data.legalCases.asPlaintiff?.length || 0) +
          (data.legalCases.asDefendant?.length || 0);
        if (score > 700 && totalCases > 0) {
          findings.push("High score with legal cases present requires review");
          confidenceScore -= 0.15;
        }
      }

      // Check litigation index alignment
      if (data.ctosLitigationIndex) {
        const litigationIndex = data.ctosLitigationIndex.index;
        if (Math.abs(score - litigationIndex) > 100) {
          findings.push(
            "Significant deviation between credit score and litigation index"
          );
          confidenceScore -= 0.25;
        }
      }
    }

    return {
      isReasonable: confidenceScore > 0.7,
      confidenceScore: Math.max(0, confidenceScore),
      findings,
    };
  }

  private static async searchCompanyInfo(companyName: string): Promise<string> {
    try {
      const response = await axios.get("https://api.duckduckgo.com/", {
        params: {
          q: `${companyName} company info financial news`,
          format: "json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error searching company info:", error);
      return "";
    }
  }

  private static async analyzeCompanyData(
    companyName: string,
    searchResults: string
  ): Promise<CompanyResearch> {
    const prompt = `Analyze this company based on the following data and provide a detailed assessment:
      Company Name: ${companyName}
      Search Results: ${searchResults}
      Known Data: ${JSON.stringify(
        companyData.companies.find((c) => c.name === companyName)
      )}`;

    const analysis = await this.queryLLM(prompt);
    return this.parseCompanyAnalysis(analysis);
  }

  private static async queryLLM(prompt: string): Promise<string> {
    console.info(
      "[OllamaReportService] Querying LLM with prompt length:",
      prompt.length
    );
    try {
      const response = await axios.post(this.OLLAMA_API, {
        model: this.MODEL,
        prompt,
        stream: false,
      });
      console.info(
        "[OllamaReportService] LLM query successful, response length:",
        response.data.response.length
      );
      return response.data.response;
    } catch (error) {
      console.error("[OllamaReportService] Error querying LLM:", error);
      throw error;
    }
  }

  private static parseCompanyAnalysis(llmResponse: string): CompanyResearch {
    try {
      // Parse LLM response into structured format
      const lines = llmResponse.split("\n");
      const summary =
        lines
          .find((l) => l.includes("Summary:"))
          ?.replace("Summary:", "")
          .trim() || "";
      const riskLevel = lines
        .find((l) => l.includes("Risk:"))
        ?.toLowerCase()
        .includes("high")
        ? "high"
        : lines
            .find((l) => l.includes("Risk:"))
            ?.toLowerCase()
            .includes("medium")
        ? "medium"
        : "low";
      const industryAnalysis =
        lines
          .find((l) => l.includes("Industry:"))
          ?.replace("Industry:", "")
          .trim() || "";
      const financialHealth =
        lines
          .find((l) => l.includes("Financial:"))
          ?.replace("Financial:", "")
          .trim() || "";
      const reputationScore = parseFloat(
        lines.find((l) => l.includes("Reputation:"))?.match(/\d+\.\d+/)?.[0] ||
          "0.8"
      );

      return {
        name: companyData.companies[0]?.name || "",
        summary,
        riskLevel,
        industryAnalysis,
        financialHealth,
        reputationScore: Math.min(Math.max(reputationScore, 0), 1),
      };
    } catch (error) {
      console.error("Error parsing company analysis:", error);
      return {
        name: "",
        summary: "",
        riskLevel: "low",
        industryAnalysis: "",
        financialHealth: "",
        reputationScore: 0.8,
      };
    }
  }

  private static async generatePersonalizedRecommendations(
    data: CreditReportData,
    transactionConsistency: { isConsistent: boolean; findings: string[] },
    companyDataConsistency: { isConsistent: boolean; findings: string[] },
    scoreReasonability: { isReasonable: boolean; findings: string[] },
    score: number
  ): Promise<string[]> {
    const prompt = `You are an expert credit analyst providing personalized recommendations for a business credit report. 

CREDIT OVERVIEW
--------------
• CTOS Credit Score: ${
      data.ctosScore?.score ? `${data.ctosScore.score} points` : "Not available"
    }
• Credit Risk Level: ${
      data.ctosScore?.score
        ? data.ctosScore.score >= 750
          ? "Low Risk"
          : data.ctosScore.score >= 650
          ? "Moderate Risk"
          : "High Risk"
        : "Not available"
    }
• Litigation Risk Index: ${
      data.ctosLitigationIndex?.index
        ? `${data.ctosLitigationIndex.index} points`
        : "Not available"
    }

RISK INDICATORS
--------------
• Active Legal Cases: ${
      (data.legalCases?.asPlaintiff?.length || 0) +
      (data.legalCases?.asDefendant?.length || 0)
    } case(s)
• Dishonoured Cheques: ${data.dishonouredCheques?.length || 0} incident(s)

FINANCIAL RELATIONSHIPS
---------------------
Banking Profile:
${
  data.bankingPaymentHistory?.accounts
    ?.map(
      (acc) => `• ${acc.bank} - ${acc.accountType}
    Status: ${acc.status}
    Payment History: ${acc.paymentHistory}`
    )
    .join("\n") || "• No banking history available"
}

Business Network:
${
  data.directorshipsBusinessInterests
    ?.map(
      (biz) => `• ${biz.name}
    Status: ${biz.status}
    Industry: ${biz.natureOfBusiness}`
    )
    .join("\n") || "• No business relationships recorded"
}

Trade References:
${
  data.tradeReferee
    ?.map(
      (ref) => `• ${ref.company}
    Rating: ${ref.rating}
    Details: ${ref.details}`
    )
    .join("\n") || "• No trade references available"
}

ANALYSIS SUMMARY
--------------
Transaction Pattern Analysis:
${transactionConsistency.findings.map((f) => `• ${f}`).join("\n")}

Business Data Analysis:
${companyDataConsistency.findings.map((f) => `• ${f}`).join("\n")}

Credit Score Analysis:
${scoreReasonability.findings.map((f) => `• ${f}`).join("\n")}

RECOMMENDATION REQUEST
--------------------
Based on this comprehensive credit profile, provide 5-7 highly personalized recommendations that:
1. Address the most critical issues first
2. Include specific, actionable steps
3. Consider both short-term improvements and long-term stability
4. Account for the business's current financial relationships

Format each recommendation as:
"[ACTION]: [SPECIFIC STEPS] - [EXPECTED IMPACT]"

Example format:
"Resolve Legal Disputes: Prioritize settlement of case #123 with Supplier A - Will improve litigation index by approximately 50 points"

Please ensure recommendations are practical, measurable, and directly tied to the data provided.`;

    try {
      const response = await this.queryLLM(prompt);
      // Split the response into individual recommendations and clean them up
      const recommendations = response
        .split(/\d+\.|[\n\r]+/)
        .map((rec) => rec.trim())
        .filter((rec) => rec.length > 0 && rec.match(/^[A-Z]/)); // Only keep lines that start with capital letters

      // Ensure we have at least some recommendations
      if (recommendations.length === 0) {
        throw new Error("No valid recommendations generated");
      }

      return recommendations;
    } catch (error) {
      console.error("Error generating personalized recommendations:", error);
      // Fallback recommendations based on score
      return [
        score < 650
          ? "Consider seeking professional financial advice to improve your credit standing"
          : score < 750
          ? "Continue your positive credit management practices"
          : "Maintain your excellent credit profile with regular monitoring",
      ];
    }
  }

  private static async generatePersonalizedAnalysisSummary(
    data: CreditReportData,
    transactionConsistency: { isConsistent: boolean; findings: string[] },
    companyDataConsistency: { isConsistent: boolean; findings: string[] },
    scoreReasonability: { isReasonable: boolean; findings: string[] },
    score: number
  ): Promise<string> {
    const prompt = `You are an expert credit analyst providing a comprehensive analysis of a business credit report.

CREDIT OVERVIEW
--------------
• CTOS Credit Score: ${
      data.ctosScore?.score ? `${data.ctosScore.score} points` : "Not available"
    }
• Credit Risk Level: ${
      data.ctosScore?.score
        ? data.ctosScore.score >= 750
          ? "Low Risk"
          : data.ctosScore.score >= 650
          ? "Moderate Risk"
          : "High Risk"
        : "Not available"
    }
• Litigation Risk Index: ${
      data.ctosLitigationIndex?.index
        ? `${data.ctosLitigationIndex.index} points`
        : "Not available"
    }

RISK INDICATORS
--------------
• Active Legal Cases: ${
      (data.legalCases?.asPlaintiff?.length || 0) +
      (data.legalCases?.asDefendant?.length || 0)
    } case(s)
• Dishonoured Cheques: ${data.dishonouredCheques?.length || 0} incident(s)

FINANCIAL RELATIONSHIPS
---------------------
Banking Profile:
${
  data.bankingPaymentHistory?.accounts
    ?.map(
      (acc) => `• ${acc.bank} - ${acc.accountType}
    Status: ${acc.status}
    Payment History: ${acc.paymentHistory}`
    )
    .join("\n") || "• No banking history available"
}

Business Network:
${
  data.directorshipsBusinessInterests
    ?.map(
      (biz) => `• ${biz.name}
    Status: ${biz.status}
    Industry: ${biz.natureOfBusiness}`
    )
    .join("\n") || "• No business relationships recorded"
}

Trade References:
${
  data.tradeReferee
    ?.map(
      (ref) => `• ${ref.company}
    Rating: ${ref.rating}
    Details: ${ref.details}`
    )
    .join("\n") || "• No trade references available"
}

ANALYSIS SUMMARY
--------------
Transaction Pattern Analysis:
${transactionConsistency.findings.map((f) => `• ${f}`).join("\n")}

Business Data Analysis:
${companyDataConsistency.findings.map((f) => `• ${f}`).join("\n")}

Credit Score Analysis:
${scoreReasonability.findings.map((f) => `• ${f}`).join("\n")}

ANALYSIS REQUEST
--------------
Based on this comprehensive credit profile, provide a detailed analysis that:
1. Evaluates the overall credit health and risk level
2. Highlights key strengths in the credit profile
3. Identifies areas of concern or potential risks
4. Analyzes the consistency and reliability of the data
5. Assesses the impact of business relationships and legal matters
6. Comments on trends and patterns in payment history and credit utilization

Format the response as a well-structured paragraph that flows naturally between topics.
Use appropriate emphasis for key metrics and findings.
Focus on providing actionable insights while maintaining a professional tone.

Example style:
"The business demonstrates a strong credit profile with a CTOS score of 750 points, indicating low risk. Notable strengths include... However, there are some areas of concern, particularly... The data consistency analysis reveals... Looking at business relationships..."`;

    try {
      const response = await this.queryLLM(prompt);
      return response.trim();
    } catch (error) {
      console.error("Error generating analysis summary:", error);
      // Return a default analysis based on the score
      return score < 650
        ? "The credit profile shows significant areas requiring immediate attention. The low credit score indicates elevated risk levels that need to be addressed through professional financial guidance and strategic improvements."
        : score < 750
        ? "The credit profile demonstrates moderate performance with room for improvement. While maintaining stability, focused efforts on key areas could enhance the overall credit standing."
        : "The credit profile exhibits strong performance with a high credit score. The current financial management practices are effective, though continued monitoring and maintenance are recommended.";
    }
  }
}
