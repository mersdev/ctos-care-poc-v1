import { Transaction } from "@/types/api";

// API Methods
export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch("/src/mock/transaction.json");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();
    return data.transactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
