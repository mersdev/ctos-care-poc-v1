import axios from "axios";
import { CreditReportData } from "@/types/creditReport";
import { fetchCreditReportData } from "@/api/creditReportApi";
import companyData from "../mock/company.json";
import tradeData from "../mock/trade.json";
import transactionData from "../mock/transaction.json";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

interface MockData {
  companies: typeof companyData.companies;
  tradeReferees: typeof tradeData.trade_referees;
  transactions: typeof transactionData.transactions;
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
  private creditData: CreditReportData | null = null;
  private mockData: MockData;
  private telegramConfig: TelegramConfig | null = null;
  private user: User | null = null;

  constructor(user?: User | null) {
    this.user = user || null;
    this.mockData = {
      companies: companyData.companies,
      tradeReferees: tradeData.trade_referees,
      transactions: transactionData.transactions,
    };
    // Initialize Telegram config from environment variables
    this.telegramConfig = {
      botToken: OllamaChatService.TELEGRAM_BOT_TOKEN,
      chatId: OllamaChatService.TELEGRAM_CHAT_ID,
    };
  }

  async initialize(): Promise<void> {
    try {
      this.creditData = await fetchCreditReportData();
    } catch (error) {
      console.error("Failed to initialize credit data:", error);
      throw error;
    }
  }

  private async sendTelegramMessage(message: string): Promise<void> {
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
    if (!this.creditData) {
      return `Hello! I'm your CTOS Credit Assistant, ready to help you understand your credit profile and financial standing. I can help you with:
      - Understanding your CTOS Score and its components
      - Explaining your credit history and payment patterns
      - Providing insights about your business interests
      - Offering tips for credit improvement
      
How can I assist you today?`;
    }

    const recentTransactions = this.mockData.transactions
      .slice(0, 5)
      .map(
        (t) =>
          `${t.date}: ${t.description} (${
            t.type === "credit" ? "+" : "-"
          }RM ${t.amount.toFixed(2)})`
      )
      .join("\n");

    const companies = this.mockData.companies
      .map(
        (c) =>
          `${c.name} (Position: ${c.position}, Shareholding: ${c.shareholding}%, Since: ${c.appoint_date})`
      )
      .join("\n");

    const ctosScore = this.creditData.ctosScore?.score || "N/A";
    const scoreAnalysis =
      ctosScore !== "N/A"
        ? Number(ctosScore) >= 700
          ? "excellent"
          : Number(ctosScore) >= 650
          ? "good"
          : Number(ctosScore) >= 600
          ? "fair"
          : "needs attention"
        : "unavailable";

    return `# CTOS Credit Assistant

I'm your dedicated CTOS Credit Assistant, here to help you understand and manage your credit profile. I have access to your latest financial information and can provide personalized insights.

## Credit Overview
- 📊 CTOS Score: ${ctosScore} (${scoreAnalysis})
- 🏦 Banking Payment History: ${
      this.creditData.bankingPaymentHistory ? "Available" : "Not available"
    }
- ⚖️ Legal Status: ${
      this.creditData.legalCases
        ? `${this.creditData.legalCases.asPlaintiff.length} case(s) as plaintiff, ${this.creditData.legalCases.asDefendant.length} case(s) as defendant`
        : "No active legal cases"
    }

## Business Interests
${companies}

## Recent Financial Activity
${recentTransactions}

## Trade References
📋 ${this.mockData.tradeReferees.length} verified trade reference(s)

## How I Can Help
- Understand your credit score and its components
- Analyze your recent financial activities
- Review your business interests and trade relationships
- Provide personalized credit improvement recommendations
- Answer questions about your credit report

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
