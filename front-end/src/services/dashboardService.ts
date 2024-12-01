import { fetchTransactions } from "@/api/dashboardApi";

export interface DashboardData {
  totalBalance: number;
  totalSpending: number;
  totalSavings: number;
  creditScore: number;
  totalGoal: number;
  monthlyData: Array<{
    name: string;
    spending: number;
    earning: number;
  }>;
  spendingData: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
  loanData: Array<{
    avatar: string;
    title: string;
    amount: number;
    monthlyPayment: number;
    monthsLeft: number;
  }>;
}

// Get the loan data from the transactions
interface LoanCategoryData {
  transactions: Array<{
    date: string;
    amount: number;
    category: string;
  }>;
  avatar: string;
  title: string;
  totalAmount: number;
  monthlyPayment: number;
}

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const transactions = await fetchTransactions();

      // Calculate totals from transactions
      const totalCredit = transactions
        .filter((t) => t.type === "credit")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalDebit = transactions
        .filter((t) => t.type === "debit")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      // Calculate total balance (credits - debits)
      const totalBalance = totalCredit - totalDebit;

      // Total spending is the sum of all debit transactions
      const totalSpending = totalDebit;

      // Total savings is the difference between credits and debits
      const totalSavings = Math.max(0, totalBalance);

      // Calculate credit score using transactions
      const totalTransactions = transactions.length;
      const latePayments = transactions.filter(
        (t) => t.type === "debit" && new Date(t.date) > new Date(t.date)
      ).length;
      const paymentHistoryScore =
        ((totalTransactions - latePayments) / totalTransactions) * 100;
      // Calculate credit utilization
      const utilizationRate = (totalDebit / totalCredit) * 100;
      const score = Math.round(
        Math.min(
          850,
          300 +
            paymentHistoryScore * 3.5 + // Payment history (35%)
            (100 - utilizationRate) * 3 // Credit utilization (30%)
        )
      );

      // Calculate the monthly spending and earning to fill the monthlyData array
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];

      // Get the current date and calculate the last 6 months
      const currentDate = new Date();
      const monthlyData = Array.from({ length: 6 }, (_, index) => {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() - (6 - index)); // Start from 5 months ago

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const monthTransactions = transactions.filter((t) =>
          t.date.startsWith(`${year}-${month}`)
        );

        const monthSpending = monthTransactions
          .filter((t) => t.type === "debit")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const monthEarning = monthTransactions
          .filter((t) => t.type === "credit")
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          name: months[date.getMonth()],
          spending: monthSpending,
          earning: monthEarning,
        };
      });

      //TODO: Get the spending data using transactions
      // Calculate spending data by category
      const spendingByCategory = transactions
        .filter((t) => t.type === "debit")
        .reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += Math.abs(t.amount);
          return acc;
        }, {} as Record<string, number>);

      // Convert to the required format for spendingData and get top 5
      const spendingData = Object.entries(spendingByCategory)
        .sort(([, a], [, b]) => b - a) // Sort by amount in descending order
        .slice(0, 5) // Take only top 5
        .map(([category, amount]) => ({
          category,
          amount,
        }));

      const loanCategories = transactions
        .filter(
          (t) =>
            t.description.toLowerCase().includes("loan") ||
            t.description.toLowerCase().includes("mortgage")
        )
        .reduce((acc, t) => {
          const key = t.category;
          if (!acc[key]) {
            acc[key] = {
              transactions: [],
              avatar:
                t.category === "Housing"
                  ? "🏠"
                  : t.category === "Transportation"
                  ? "🚗"
                  : t.category === "Education"
                  ? "📚"
                  : "💰",
              title: `${t.category} Loan`,
              totalAmount: 0,
              monthlyPayment: 0,
            };
          }
          acc[key].transactions.push(t);
          acc[key].totalAmount += Math.abs(t.amount);
          return acc;
        }, {} as Record<string, LoanCategoryData>);

      interface MonthlyPayment {
        month: string;
        amount: number;
      }

      const loanData = Object.entries(loanCategories).map(([_, data]) => {
        const monthlyPayments = data.transactions.reduce(
          (payments: MonthlyPayment[], t) => {
            const month = t.date.substring(0, 7); // Get YYYY-MM
            if (!payments.find((p) => p.month === month)) {
              payments.push({ month, amount: Math.abs(t.amount) });
            }
            return payments;
          },
          []
        );

        const avgMonthlyPayment =
          monthlyPayments.length > 0
            ? monthlyPayments.reduce(
                (sum: number, payment) => sum + payment.amount,
                0
              ) / monthlyPayments.length
            : data.totalAmount / 12;

        return {
          avatar: data.avatar,
          title: data.title,
          amount: data.totalAmount,
          monthlyPayment: Math.round(avgMonthlyPayment),
          monthsLeft: Math.ceil(data.totalAmount / avgMonthlyPayment),
        };
      });

      return {
        totalBalance,
        totalSpending,
        totalSavings,
        creditScore: score,
        totalGoal: 4,
        monthlyData: monthlyData,
        spendingData: spendingData,
        loanData: loanData,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Return mock data for now
      return {
        totalBalance: 5231.89,
        totalSpending: 3352.4,
        totalSavings: 1879.49,
        creditScore: 742,
        totalGoal: 4,
        monthlyData: [
          { name: "Jan", spending: 800, earning: 1000 },
          { name: "Feb", spending: 900, earning: 1200 },
          { name: "Mar", spending: 1000, earning: 900 },
          { name: "Apr", spending: 1100, earning: 1500 },
          { name: "May", spending: 1300, earning: 1800 },
          { name: "Jun", spending: 1500, earning: 2000 },
        ],
        spendingData: [
          { category: "Housing", amount: 1000,color:"#b6abff" },
          { category: "Food", amount: 500 ,color:"#baffd2"},
          { category: "Transportation", amount: 300,color:"#fffddb"},
          { category: "Utilities", amount: 200 ,color:"#fc5b63"},
          { category: "Entertainment", amount: 150,color:"#99c99b"},
        ],
        loanData: [
          {
            avatar: "🏠",
            title: "Housing Loan",
            amount: 10000,
            monthlyPayment: 500,
            monthsLeft: 12,
          },
          {
            avatar: "🚗",
            title: "Transportation Loan",
            amount: 5000,
            monthlyPayment: 200,
            monthsLeft: 6,
          },
        ],
      };
    }
  }
}
