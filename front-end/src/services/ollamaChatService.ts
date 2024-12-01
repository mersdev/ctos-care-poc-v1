import axios from "axios";
import transactionData from "../mock/transaction.json";
import {
  CreditMetrics,
  FTOSAnalysis,
  IncomeMetrics,
  OtherMetrics,
  ProjectionMetrics,
  CashFlowMetrics,
  BehavioralMetrics,
  IDVerificationData,
} from "@/types/ftos";

interface MockData {
  transactions: typeof transactionData.transactions;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface User {
  email?: string;
  name?: string;
}

export class OllamaChatService {
  private static readonly OLLAMA_API = import.meta.env.VITE_OLLAMA_API_URL;
  private static readonly MODEL = import.meta.env.VITE_OLLAMA_MODEL;
  private static readonly TELEGRAM_API = import.meta.env.VITE_TELEGRAM_API_URL;
  private static readonly TELEGRAM_BOT_TOKEN = import.meta.env
    .VITE_TELEGRAM_BOT_TOKEN;
  private static readonly TELEGRAM_CHAT_ID = import.meta.env
    .VITE_TELEGRAM_CHAT_ID;
  private static readonly MAGIC_WORDS = [
    "urgent",
    "emergency",
    "critical",
    "alert",
    "complain",
  ];

  private messages: ChatMessage[] = [];
  private storedData: FTOSAnalysis | null = null;
  private telegramConfig: TelegramConfig | null = null;
  private user: User | null = null;
  private mockData: MockData | null = null;

  constructor(user?: User | null) {
    this.user = user || null;
    // Initialize Telegram config from environment variables
    this.telegramConfig = {
      botToken: OllamaChatService.TELEGRAM_BOT_TOKEN,
      chatId: OllamaChatService.TELEGRAM_CHAT_ID,
    };
  }

  async initialize(): Promise<void> {
    try {
      const incomeMetrics = JSON.parse(
        localStorage.getItem("ftos_income_metrics") || "{}"
      ) as IncomeMetrics;
      const creditMetrics = JSON.parse(
        localStorage.getItem("ftos_credit_metrics") || "{}"
      ) as CreditMetrics;
      const cashFlowMetrics = JSON.parse(
        localStorage.getItem("ftos_cashflow_metrics") || "{}"
      ) as CashFlowMetrics;
      const projectionMetrics = JSON.parse(
        localStorage.getItem("ftos_projection_metrics") || "{}"
      ) as ProjectionMetrics;
      const behavioralMetrics = JSON.parse(
        localStorage.getItem("ftos_behavioral_metrics") || "{}"
      ) as BehavioralMetrics;
      const otherMetrics = JSON.parse(
        localStorage.getItem("ftos_other_metrics") || "{}"
      ) as OtherMetrics;
      const idVerification = JSON.parse(
        localStorage.getItem("ftos_id_verification") || "{}"
      ) as IDVerificationData;

      this.storedData = {
        income_metrics: incomeMetrics,
        credit_metrics: creditMetrics,
        cash_flow_metrics: cashFlowMetrics,
        projection_metrics: projectionMetrics,
        behavioral_metrics: behavioralMetrics,
        other_metrics: otherMetrics,
        id_verification: idVerification,
      };

      this.mockData = {
        transactions: transactionData.transactions,
      };

      if (
        Object.keys(this.storedData.income_metrics).length === 0 &&
        Object.keys(this.storedData.credit_metrics).length === 0 &&
        Object.keys(this.storedData.cash_flow_metrics).length === 0
      ) {
        console.warn("No FTOS Analysis data found in localStorage");
        this.storedData = null;
      }
    } catch (error) {
      console.error("Failed to initialize FTOS data from localStorage:", error);
      this.storedData = null;
      throw error;
    }
  }

  async sendTelegramMessage(message: string): Promise<void> {
    if (!this.telegramConfig) {
      console.warn("Telegram configuration not provided");
      return;
    }

    const { botToken, chatId } = this.telegramConfig;
    // Format chat ID to ensure it starts with -100 for supergroups
    const url = `${OllamaChatService.TELEGRAM_API}${botToken}/sendMessage`;

    try {
      console.log("Attempting to send Telegram message:", {
        url: url,
        chatId: chatId,
        messageLength: message.length,
      });

      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: "html",
      });

      if (response.data.ok) {
        console.log("Telegram message sent successfully:", {
          messageId: response.data.result.message_id,
          chatId: response.data.result.chat.id,
        });
      } else {
        console.error(
          "Telegram API returned false 'ok' status:",
          response.data
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        console.error("Telegram API Error Details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          errorCode: errorResponse?.error_code,
          errorDescription: errorResponse?.description,
          requestData: {
            originalChatId: chatId,
            messageLength: message.length,
            url: url,
          },
          headers: error.response?.headers,
          config: {
            method: error.config?.method,
            baseURL: error.config?.baseURL,
            headers: error.config?.headers,
          },
        });

        // Specific error handling based on Telegram API error codes
        if (errorResponse?.error_code === 401) {
          console.error("Bot token is invalid");
        } else if (errorResponse?.error_code === 400) {
          console.error(
            "Bad request - check chat_id and message format. Note: For supergroups, chat_id should start with -100"
          );
        } else if (errorResponse?.error_code === 403) {
          console.error("Bot was blocked by the user or group");
        } else if (errorResponse?.error_code === 429) {
          console.error("Too Many Requests - rate limit exceeded");
        }
      } else {
        console.error("Non-Axios error occurred:", {
          error: error,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  private containsMagicWord(message: string): boolean {
    return OllamaChatService.MAGIC_WORDS.some((word) =>
      message.toLowerCase().includes(word.toLowerCase())
    );
  }

  private buildContext(): string {
    if (!this.storedData) {
      return `Hello! I'm your Financial Health Assistant, ready to help you understand your financial profile and standing. I can help you with:
      - Understanding your Income and Credit metrics
      - Analyzing your Cash Flow patterns
      - Reviewing your Behavioral metrics
      - Providing financial projections and insights
      
How can I assist you today?`;
    }

    const {
      income_metrics,
      credit_metrics,
      cash_flow_metrics,
      projection_metrics,
    } = this.storedData;

    const recentTransactions =
      this.mockData?.transactions
        ?.slice(0, 5)
        ?.map(
          (t) =>
            `${t.date}: ${t.description} (${
              t.type === "credit" ? "+" : "-"
            }RM ${t.amount.toFixed(2)})`
        )
        ?.join("\n") || "No recent transactions available";

    const creditScore = credit_metrics.score || "N/A";
    const scoreAnalysis =
      creditScore !== "N/A"
        ? creditScore >= 700
          ? "excellent"
          : creditScore >= 650
          ? "good"
          : creditScore >= 600
          ? "fair"
          : "needs attention"
        : "unavailable";

    return `Hello! I'm your dedicated Financial Health Assistant, here to help you understand and manage your financial profile. I have access to your latest financial information and can provide personalized insights.

## Income Overview
- 💰 Monthly Average: RM${income_metrics.monthly_average.toFixed(2)}
- 📈 Growth Rate: ${income_metrics.growth_rate}%
- 🎯 Stability Score: ${income_metrics.stability_score}

## Credit Profile
- 📊 Credit Score: ${creditScore} (${scoreAnalysis})
- 💳 Payment History: ${credit_metrics.payment_history}
- 📉 Credit Utilization: ${credit_metrics.credit_utilization}

## Cash Flow Analysis
- 💵 Monthly Net Flow: RM${cash_flow_metrics.monthly_net_flow.toFixed(2)}
- 📊 Volatility: ${cash_flow_metrics.volatility}
- 💰 Emergency Fund: ${cash_flow_metrics.emergency_fund_months} months coverage

## Financial Projections
- 📈 6-Month Growth Rate: ${projection_metrics.growth_rate_6m[0]}%
- ⭐ Confidence Score: ${projection_metrics.confidence_score}
${
  projection_metrics.risk_factors.length > 0
    ? `- ⚠️ Risk Factors: ${projection_metrics.risk_factors.join(", ")}`
    : ""
}

## Recent Transactions
${recentTransactions}

## How I Can Help
- Analyze your income patterns and stability
- Review your credit profile and suggest improvements
- Provide cash flow insights and recommendations
- Share financial projections and growth opportunities
- Answer questions about your financial health

How may I assist you today?`;
  }

  async getInitialMessage(): Promise<string> {
    return this.buildContext();
  }

  private generateTicketId(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${day}${month}${year}-${random}`;
  }

  private async generateTelegramMessage(
    message: string,
    ticketId: string
  ): Promise<string> {
    const prompt = `Generate a professional customer complaint alert message for a CTOS credit report service. Use this information:
- Ticket ID: ${ticketId}
- Customer Name: ${this.user?.name || "Not Provided"}
- Customer Email: ${this.user?.email || "Not Provided"}
- Customer Message: "${message}"
- Chat History: ${this.messages.map((m) => m.content).join("\n")}

The message should:
1. Be formatted in HTML (use <b> for bold, <i> for italic)
2. Include a severity assessment based on the message content
3. Suggest specific solutions based on the complaint
4. Maintain a professional tone
5. Include relevant emojis for better visibility

Example Message:
<b>New Customer Complaint Alert</b>

<b>Ticket ID:</b> ${ticketId}
<b>Customer Name:</b> ${this.user?.name || "Not Provided"}
<b>Customer Email:</b> ${this.user?.email || "Not Provided"}

<b>Complaint Message:</b>
${message}

<b>Reason for Complaint:</b>
General dissatisfaction with CTOS service or report accuracy

<b>Recommended Solutions:</b>
1. Immediate review of customer's credit report
2. Schedule follow-up with customer service team
3. Investigate potential data accuracy issues
4. Provide detailed explanation of credit scoring

<b>Status:</b> Pending Review
<i>Please handle this complaint with priority.</i>
`;

    try {
      const response = await axios.post(
        OllamaChatService.OLLAMA_API,
        {
          model: OllamaChatService.MODEL,
          prompt: prompt,
          system:
            "You are a professional customer service assistant for CTOS, a credit reporting agency. Generate concise, actionable Telegram alerts for customer complaints.",
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.response;
    } catch (error) {
      console.error("Error generating Telegram message:", error);
      // Fallback to default template if Ollama fails
      return `🚨 <b>New Customer Complaint Alert</b>

<b>Ticket ID:</b> ${ticketId}
<b>Customer Name:</b> ${this.user?.name || "Not Provided"}
<b>Customer Email:</b> ${this.user?.email || "Not Provided"}

<b>Complaint Message:</b>
${message}

<b>Reason for Complaint:</b>
General dissatisfaction with CTOS service or report accuracy

<b>Recommended Solutions:</b>
1. Immediate review of customer's credit report
2. Schedule follow-up with customer service team
3. Investigate potential data accuracy issues
4. Provide detailed explanation of credit scoring

<b>Status:</b> Pending Review
<i>Please handle this complaint with priority.</i>`;
    }
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const context = await this.buildContext();
      const response = await axios.post(
        OllamaChatService.OLLAMA_API,
        {
          model: OllamaChatService.MODEL,
          prompt: message,
          system: context,
          stream: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botResponse = response.data.response;

      // Check for magic words and send Telegram notification if needed
      try {
        if (this.containsMagicWord(message)) {
          const ticketId = this.generateTicketId();
          const telegramMessage = await this.generateTelegramMessage(
            message,
            ticketId
          );
          await this.sendTelegramMessage(telegramMessage);
        }
      } catch (telegramError) {
        console.error("Telegram notification failed:", telegramError);
      }

      return botResponse;
    } catch (error) {
      console.error("Error in sendMessage:", error);
      throw error;
    }
  }

  clearHistory(): void {
    this.messages = [];
  }
}
