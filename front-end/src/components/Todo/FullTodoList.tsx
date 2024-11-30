import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../ui/table";
import { Card } from "../ui/card";
import {
  IconCheck,
  IconClock,
  IconHourglassHigh,
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
} from "@tabler/icons-react";

const tasks = [
  {
    task: "Check your credit report for inaccuracies",
    deadline: "2024-11-30",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Dispute any errors found on the credit report",
    deadline: "2024-12-05",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Set up payment reminders for outstanding debts",
    deadline: "2024-11-25",
    status: "Completed",
    status_code: 3,
  },
  {
    task: "Pay down balances on credit cards",
    deadline: "2024-12-10",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Apply for a credit limit increase",
    deadline: "2024-12-20",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Avoid opening new credit card accounts",
    deadline: "2024-12-25",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Make all loan payments on time",
    deadline: "2025-01-01",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Review outstanding debts for consolidation options",
    deadline: "2025-01-05",
    status: "Completed",
    status_code: 3,
  },
  {
    task: "Automate your bill payments",
    deadline: "2025-01-10",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Close unused credit accounts",
    deadline: "2025-01-15",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Create a monthly budget to track spending",
    deadline: "2025-01-20",
    status: "Completed",
    status_code: 3,
  },
  {
    task: "Update financial records",
    deadline: "2025-02-01",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Review insurance policies",
    deadline: "2025-02-10",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Save for an emergency fund",
    deadline: "2025-02-15",
    status: "Completed",
    status_code: 3,
  },
  {
    task: "Invest in retirement accounts",
    deadline: "2025-03-01",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Review tax documents",
    deadline: "2025-03-10",
    status: "Pending",
    status_code: 2,
  },
  {
    task: "Evaluate savings goals",
    deadline: "2025-03-20",
    status: "Completed",
    status_code: 3,
  },
  {
    task: "Plan for large expenses",
    deadline: "2025-04-01",
    status: "In Progress",
    status_code: 1,
  },
  {
    task: "Consult a financial advisor",
    deadline: "2025-04-15",
    status: "Pending",
    status_code: 2,
  },
];

const FullTodoList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const getStatusIcon = (status_code: number) => {
    switch (status_code) {
      case 1: // In Progress
        return <IconClock className="text-yellow-500" size={18} />;
      case 2: // Pending
        return <IconHourglassHigh className="text-red-500" size={18} />;
      case 3: // Completed
        return <IconCheck className="text-green-500" size={18} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4">Todo Tasks List</h1>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="focus:outline-none pointer-events-none">
                Task
              </TableHead>
              <TableHead className="focus:outline-none pointer-events-none">
                Deadline
              </TableHead>
              <TableHead className="focus:outline-none pointer-events-none">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTasks.map((task, index) => (
              <TableRow key={index}>
                <TableCell>{task.task}</TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell className="flex gap-2 items-center">
                  {getStatusIcon(task.status_code)} {task.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`p-2 rounded-lg ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary"
          } text-white`}
        >
          <IconPlayerTrackPrevFilled size={18} />
        </button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`p-2 rounded-lg flex ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary"
          } text-white`}
        >
          <IconPlayerTrackNextFilled size={18} />
        </button>
      </div>
    </div>
  );
};

export default FullTodoList;
