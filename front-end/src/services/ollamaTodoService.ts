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
import { Todo } from "@/types/todo";
import { v4 as uuidv4 } from "uuid";

interface MockData {
  transactions: typeof transactionData.transactions;
}

export class OllamaTodoService {
  private static readonly OLLAMA_API = import.meta.env.VITE_OLLAMA_API_URL;
  private static readonly MODEL = import.meta.env.VITE_OLLAMA_MODEL;
  private static storedData: FTOSAnalysis | null = null;
  private static mockData: MockData | null = null;

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

      OllamaTodoService.storedData = {
        income_metrics: incomeMetrics,
        credit_metrics: creditMetrics,
        cash_flow_metrics: cashFlowMetrics,
        projection_metrics: projectionMetrics,
        behavioral_metrics: behavioralMetrics,
        other_metrics: otherMetrics,
        id_verification: idVerification,
      };

      OllamaTodoService.mockData = {
        transactions: transactionData.transactions,
      };

      if (
        Object.keys(OllamaTodoService.storedData.income_metrics).length === 0 &&
        Object.keys(OllamaTodoService.storedData.credit_metrics).length === 0 &&
        Object.keys(OllamaTodoService.storedData.cash_flow_metrics).length === 0
      ) {
        console.warn("No FTOS Analysis data found in localStorage");
        OllamaTodoService.storedData = null;
      }
    } catch (error) {
      console.error("Failed to initialize FTOS data from localStorage:", error);
      OllamaTodoService.storedData = null;
      throw error;
    }
  }

  private static async queryLLM(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${OllamaTodoService.OLLAMA_API}`, {
        model: OllamaTodoService.MODEL,
        prompt,
        stream: false,
      });

      return response.data.response;
    } catch (error) {
      console.error("Failed to query LLM:", error);
      throw new Error("Failed to generate todo list");
    }
  }

  static async generateTodoList(): Promise<Todo[]> {
    if (!OllamaTodoService.storedData) {
      throw new Error("No FTOS analysis data available");
    }

    const prompt = `Based on the user's financial data and transaction history, generate 10 personalized and achievable todo items. Focus on the user's actual spending patterns and behavior to suggest realistic improvements.

Transaction History:
${JSON.stringify(OllamaTodoService.mockData?.transactions, null, 2)}

FTOS Analysis Data:
${JSON.stringify(OllamaTodoService.storedData, null, 2)}

Consider the following when generating todos:
1. User's current spending patterns and categories
2. Regular bills and payment schedules
3. Credit card payment due dates
4. Loan payment schedules
5. Savings goals and transfers

Format each todo as a JSON object with these exact fields:
{
  "id": "uuid string",
  "title": "specific and achievable task title",
  "description": "personalized action description based on user's actual behavior",
  "priority": "high|medium|low",
  "dueDate": "ISO date string within next 3 months",
  "category": "financial|credit|savings|investment|debt",
  "completed": false,
  "impact": number 1-10,
  "next_actions": "For payment-related tasks, use format: ?trans_title=Task_Name&amount=Amount. Leave empty for non-payment tasks"
}

Generate exactly 10 todos in a JSON array format. Each todo should be:
1. Identify regular payment tasks (bills, credit cards, loans)
2. Include specific payment amounts based on transaction history
3. Set appropriate due dates for recurring payments
4. Leave next_actions empty for non-payment tasks
5. Use underscore for spaces in trans_title

Examples of good personalized todos:

1. Payment-related todo:
{
  "id": "uuid",
  "title": "Pay Credit Card Bill",
  "description": "Monthly credit card payment due. Current statement balance: RM 2,500",
  "priority": "high",
  "dueDate": "2024-01-28T00:00:00.000Z",
  "category": "credit",
  "completed": false,
  "impact": 9,
  "next_actions": "?trans_title=Pay_Credit_Card_Bill&amount=2500"
}

2. Non-payment todo:
{
  "id": "uuid",
  "title": "Review Monthly Expenses",
  "description": "Analyze last month's spending patterns to identify areas for improvement",
  "priority": "medium",
  "dueDate": "2024-02-01T00:00:00.000Z",
  "category": "financial",
  "completed": false,
  "impact": 7,
  "next_actions": ""
}`;

    try {
      const response = await OllamaTodoService.queryLLM(prompt);

      // Extract JSON array from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const todos = JSON.parse(jsonMatch[0]);

      // Validate and format todos
      return todos.map((todo: any) => ({
        ...todo,
        id: uuidv4(),
        completed: false,
        dueDate: new Date(todo.dueDate).toISOString(),
        impact: Number(todo.impact),
        next_actions: todo.next_actions || "",
      }));
    } catch (error) {
      console.error("Failed to generate todo list:", error);

      // Return mock data as fallback
      return [
        {
          id: uuidv4(),
          title: "Pay Monthly Credit Card Bill",
          description:
            "Your credit card payment is due soon. Current balance: RM 1,800",
          priority: "high",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          category: "credit",
          completed: false,
          impact: 9,
          next_actions: "?trans_title=Pay_Credit_Card_Bill&amount=1800",
        },
        {
          id: uuidv4(),
          title: "Transfer to Emergency Fund",
          description: "Monthly savings transfer to build emergency fund",
          priority: "high",
          dueDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          category: "savings",
          completed: false,
          impact: 8,
          next_actions: "?trans_title=Emergency_Fund_Transfer&amount=500",
        },
      ];
    }
  }
}
