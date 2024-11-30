export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  dueDate: string; // ISO date string
  category: "financial" | "credit" | "savings" | "investment" | "debt";
  completed: boolean;
  impact: number; // 1-10 scale of financial impact
  next_actions: string;
}
