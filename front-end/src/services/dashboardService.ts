import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/dashboard`;

export interface DashboardData {
  totalBalance: number;
  totalSpending: number;
  totalSavings: number;
  creditScore: number;
  totalGoal: number;
  monthlyData: Array<{
    name: string;
    total: number;
  }>;
  spendingData: Array<{
    category: string;
    amount: number;
    color: string;
  }>;
}

export class DashboardService {
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await axios.get<DashboardData>(API_URL);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Return mock data for now
      return {
        totalBalance: 5231.89,
        totalSpending: 3352.40,
        totalSavings: 1879.49,
        creditScore: 742,
        totalGoal:4,
        monthlyData: [
          { name: "Jan", total: 1000 },
          { name: "Feb", total: 1200 },
          { name: "Mar", total: 900 },
          { name: "Apr", total: 1500 },
          { name: "May", total: 1800 },
          { name: "Jun", total: 2000 },
        ],
        spendingData: [
          { category: "Housing", amount: 1000,color:"#b6abff" },
          { category: "Food", amount: 500 ,color:"#baffd2"},
          { category: "Transportation", amount: 300,color:"#fffddb"},
          { category: "Utilities", amount: 200 ,color:"#fc5b63"},
          { category: "Entertainment", amount: 150,color:"#99c99b"},
        ],
      };
    }
  }
}
