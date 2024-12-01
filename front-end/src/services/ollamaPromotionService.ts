import { CreditCard, Loan, Transaction } from "@/types/api";
import { fetchCreditCard, fetchLoans } from "@/api/promotionApi";
import axios from "axios";

interface CreditAnalysis {
  creditScore: number;
  monthlyIncome: number;
  transactions: Transaction[];
  existingLoans?: Loan[];
  existingCreditCards?: CreditCard[];
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

export class OllamaPromotionService {
  private static instance: OllamaPromotionService;
  private initialized = false;
  private static readonly OLLAMA_API_URL =
    import.meta.env.VITE_OLLAMA_API_URL ||
    "http://localhost:11434/api/generate";
  private static readonly MODEL =
    import.meta.env.VITE_OLLAMA_MODEL || "mistral";

  private constructor() {}

  private static mockData: {
    loans: Loan[];
    creditCards: CreditCard[];
  } = {
    loans: [],
    creditCards: [],
  };

  public static getInstance(): OllamaPromotionService {
    if (!OllamaPromotionService.instance) {
      OllamaPromotionService.instance = new OllamaPromotionService();
    }
    return OllamaPromotionService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const [loans, creditCards] = await Promise.all([
        fetchLoans(),
        fetchCreditCard(),
      ]);
      OllamaPromotionService.mockData = {
        loans,
        creditCards,
      };
      this.initialized = true;
    } catch (error) {
      console.error("[OllamaPromotionService] Initialization failed:", error);
      throw error;
    }
  }

  private static async queryOllama(prompt: string): Promise<any> {
    try {
      const response = await axios.post<OllamaResponse>(
        OllamaPromotionService.OLLAMA_API_URL,
        {
          model: OllamaPromotionService.MODEL,
          prompt,
          stream: false,
        }
      );

      if (!response.data || !response.data.response) {
        throw new Error("Invalid response from Ollama API");
      }

      const responseText = response.data.response;
      console.log("[OllamaPromotionService] Raw Response:", responseText);

      try {
        // Try to parse the response as JSON first
        const parsedResponse = JSON.parse(responseText);
        if (parsedResponse && Array.isArray(parsedResponse.loan_name || parsedResponse.card_name)) {
          return {
            recommendations: parsedResponse.loan_name || parsedResponse.card_name
          };
        }
      } catch (parseError) {
        console.log("[OllamaPromotionService] JSON parse failed, trying regex fallback");
      }

      // Fallback to regex pattern matching
      const arrayMatch = responseText.match(/["'](?:loan_name|card_name)["']\s*:\s*\[(.*?)\]/s);
      if (!arrayMatch) {
        console.log("[OllamaPromotionService] No array match found in response");
        return null;
      }

      const namesString = arrayMatch[1];
      const names = namesString
        .split(',')
        .map(name => name.trim().replace(/^["']|["']$/g, ''))
        .filter(name => name.length > 0);

      return { recommendations: names };
    } catch (error) {
      console.error("[OllamaPromotionService] Error querying Ollama:", error);
      return null;
    }
  }

  public static async generateLoanRecommendations(
    analysis: CreditAnalysis
  ): Promise<Loan[]> {
    try {
      const { creditScore, monthlyIncome, transactions } = analysis;

      const prompt = `Given a customer with:
- Credit score: ${creditScore}
- Monthly income: RM${monthlyIncome}
- Transaction history: ${
        transactions.length
      } transactions totaling RM${transactions.reduce(
        (sum, t) => sum + t.amount,
        0
      )}

Available loans:
${OllamaPromotionService.mockData.loans
  .map((loan) => `- ${loan.loan_name}`)
  .join("\n")}

Based on this data, recommend the top 3 most suitable loans for this customer.
Don't add any other text, just return the response in this EXACT format:
{
  "loan_name": ["first loan name", "second loan name", "third loan name"]
}
Example Output: 
{
  "loan_name": [
    "Bank Rakyat Easy Instalment Plan",
    "Public Bank Flexipay Plan",
    "AEON Cards 0% Instalment Payment Plan"
  ]
}  
`;

      const response = await OllamaPromotionService.queryOllama(prompt);
      if (!response?.recommendations) {
        return [];
      }

      // Filter loans that match any of the recommended names
      return OllamaPromotionService.mockData.loans
        .filter((loan) => response.recommendations.includes(loan.loan_name))
        .slice(0, 3);
    } catch (error) {
      console.error(
        "[OllamaPromotionService] Error generating loan recommendations:",
        error
      );
      return [];
    }
  }

  public static async generateCreditCardRecommendations(
    analysis: CreditAnalysis
  ): Promise<CreditCard[]> {
    try {
      const { creditScore, monthlyIncome, transactions } = analysis;

      const spendingCategories = transactions.reduce(
        (acc: { [key: string]: number }, t) => {
          acc[t.category] = (acc[t.category] || 0) + t.amount;
          return acc;
        },
        {}
      );

      const prompt = `Given a customer with:
- Credit score: ${creditScore}
- Monthly income: RM${monthlyIncome}
- Transaction history: ${transactions.length} transactions

Spending Patterns:
${Object.entries(spendingCategories)
  .map(([category, amount]) => `- ${category}: RM${amount.toFixed(2)}`)
  .join("\n")}

Available credit cards:
${OllamaPromotionService.mockData.creditCards
  .map((card) => `- ${card.card_name}`)
  .join("\n")}

Based on this data, recommend the top 3 most suitable credit cards for this customer.
Don't add any other text, just return the response in this EXACT format:
{
  "card_name": ["first card name", "second card name", "third card name"]
}
  
Example Output: 
{
  "card_name": [
    "HSBC Platinum Credit Card",
    "Standard Chartered Journey Credit Card",
    "UOB ONE Card"
  ]
}
`;

      const response = await OllamaPromotionService.queryOllama(prompt);
      if (!response?.recommendations) {
        return [];
      }

      // Filter cards that match any of the recommended names
      return OllamaPromotionService.mockData.creditCards
        .filter((card) => response.recommendations.includes(card.card_name))
        .slice(0, 3);
    } catch (error) {
      console.error(
        "[OllamaPromotionService] Error generating credit card recommendations:",
        error
      );
      return [];
    }
  }
}
