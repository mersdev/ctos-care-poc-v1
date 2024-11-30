import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";

const tasks = [
  {
    task: "Check your credit report for inaccuracies",
    deadline: "2024-11-30",
    status: "In Progress",
  },
  {
    task: "Dispute any errors found on the credit report",
    deadline: "2024-12-05",
    status: "Pending",
  },
  {
    task: "Set up payment reminders for outstanding debts",
    deadline: "2024-11-25",
    status: "Completed",
  },
  {
    task: "Pay down balances on credit cards",
    deadline: "2024-12-10",
    status: "Pending",
  },
  {
    task: "Apply for a credit limit increase",
    deadline: "2024-12-20",
    status: "Pending",
  },
  {
    task: "Avoid opening new credit card accounts",
    deadline: "2024-12-25",
    status: "In Progress",
  },
  {
    task: "Make all loan payments on time",
    deadline: "2025-01-01",
    status: "Pending",
  },
  {
    task: "Review outstanding debts for consolidation options",
    deadline: "2025-01-05",
    status: "Completed",
  },
  {
    task: "Automate your bill payments",
    deadline: "2025-01-10",
    status: "In Progress",
  },
  {
    task: "Close unused credit accounts",
    deadline: "2025-01-15",
    status: "Pending",
  },
  {
    task: "Create a monthly budget to track spending",
    deadline: "2025-01-20",
    status: "Completed",
  },
  {
    task: "Update financial records",
    deadline: "2025-02-01",
    status: "Pending",
  },
  {
    task: "Review insurance policies",
    deadline: "2025-02-10",
    status: "In Progress",
  },
  {
    task: "Save for an emergency fund",
    deadline: "2025-02-15",
    status: "Completed",
  },
  {
    task: "Invest in retirement accounts",
    deadline: "2025-03-01",
    status: "In Progress",
  },
  { task: "Review tax documents", deadline: "2025-03-10", status: "Pending" },
  {
    task: "Evaluate savings goals",
    deadline: "2025-03-20",
    status: "Completed",
  },
  {
    task: "Plan for large expenses",
    deadline: "2025-04-01",
    status: "In Progress",
  },
  {
    task: "Consult a financial advisor",
    deadline: "2025-04-15",
    status: "Pending",
  },
];

const FullTodoList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  return (
    <div className="mt-8 rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Todo Tasks List</h3>
      <Table className="border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentTasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell>{task.task}</TableCell>
              <TableCell>{task.deadline}</TableCell>
              <TableCell>{task.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary"
          } text-white`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary"
          } text-white`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FullTodoList;
