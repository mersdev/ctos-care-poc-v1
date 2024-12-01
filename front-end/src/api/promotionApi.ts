import { CreditCard, Loan, Transaction } from "@/types/api";

export async function fetchTransactions(): Promise<Transaction[]> {
  try {
    const response = await fetch("/src/mock/transaction.json");
    if (!response.ok) {
      throw new Error("Failed to fetch transactions");
    }
    const data = await response.json();
    return data.transactions.slice(0, 20);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

export async function fetchCreditCard(): Promise<CreditCard[]> {
  try {
    const response = await fetch("/src/mock/creditCards.json");
    if (!response.ok) {
      throw new Error("Failed to fetch credit card");
    }
    const data = await response.json();
    // Return only the first 20 credit cards
    return data.credit_cards.slice(0, 20);
  } catch (error) {
    console.error("Error fetching credit card:", error);
    throw error;
  }
}

export async function fetchLoans(): Promise<Loan[]> {
  try {
    const response = await fetch("/src/mock/loans.json");
    if (!response.ok) {
      throw new Error("Failed to fetch loans");
    }
    const data = await response.json();
    return data.loans.slice(0, 10);
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
}
