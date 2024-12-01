import {
  Transaction,
  UserProfile,
  CustomerFeedback,
  Trading,
} from "@/types/api";

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

export async function fetchCustomerFeedback(): Promise<CustomerFeedback[]> {
  try {
    const response = await fetch("/src/mock/customerFeedback.json");
    if (!response.ok) {
      throw new Error("Failed to fetch customer feedback");
    }
    const data = await response.json();
    return data.feedbacks;
  } catch (error) {
    console.error("Error fetching customer feedback:", error);
    throw error;
  }
}

export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const response = await fetch("/src/mock/userProfile.json");
    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function fetchTradings(): Promise<Trading[]> {
  try {
    const response = await fetch("/src/mock/tradings.json");
    if (!response.ok) {
      throw new Error("Failed to fetch tradings");
    }
    const data = await response.json();
    return data.tradings;
  } catch (error) {
    console.error("Error fetching tradings:", error);
    throw error;
  }
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};
