import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  IconPlayerTrackNextFilled,
  IconPlayerTrackPrevFilled,
  IconAlertCircle,
  IconCalendar,
  IconCategory,
  IconChartBar,
  IconCreditCard,
} from "@tabler/icons-react";
import { OllamaTodoService } from "@/services/ollamaTodoService";
import { useToast } from "@/components/ui/use-toast";
import { Todo } from "@/types/todo";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalPages = Math.ceil(todos.length / tasksPerPage);
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = todos.slice(indexOfFirstTask, indexOfLastTask);

  // Add storage event listener for updates
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "todos" && e.newValue) {
        console.log("[TodoList] Storage event received:", {
          key: e.key,
          newValue: e.newValue,
        });

        const updatedTodos = JSON.parse(e.newValue);
        setTodos(updatedTodos);
      }
    };

    // Add listener for storage events
    window.addEventListener("storage", handleStorageChange);

    // Also add a custom event listener for same-window updates
    const handleCustomEvent = (e: Event) => {
      const storageEvent = e as StorageEvent;
      if (storageEvent.key === "todos" && storageEvent.newValue) {
        const updatedTodos = JSON.parse(storageEvent.newValue);
        setTodos(updatedTodos);
      }
    };

    window.addEventListener("storage", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("storage", handleCustomEvent);
    };
  }, []);

  // Load initial data
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedTodos = localStorage.getItem("todos");
        console.log("[TodoList] Loading saved todos:", savedTodos);

        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos);
          console.log("[TodoList] Parsed todos:", parsedTodos);
          setTodos(parsedTodos);
        } else {
          console.log("[TodoList] No saved todos found, initializing new list");
          initializeNewTodoList();
        }
      } catch (error) {
        console.error("[TodoList] Error loading saved data:", error);
        toast({
          title: "Error",
          description: "Failed to load todo data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSavedData();
  }, [toast]);

  const handleTodoCompletion = (todoId: string) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );

      console.log("[TodoList] Updating todo completion:", {
        todoId,
        updatedTodos,
      });

      // Update localStorage
      localStorage.setItem("todos", JSON.stringify(updatedTodos));

      // Dispatch storage event for other windows
      const event = new StorageEvent("storage", {
        key: "todos",
        newValue: JSON.stringify(updatedTodos),
        url: window.location.href,
        storageArea: localStorage,
      });
      window.dispatchEvent(event);

      return updatedTodos;
    });
  };

  const initializeNewTodoList = async () => {
    try {
      const service = new OllamaTodoService();
      await service.initialize();
      const data = await OllamaTodoService.generateTodoList();

      // Ensure each todo has a completed property
      const todosWithCompletion = data.map((todo) => ({
        ...todo,
        completed: todo.completed || false,
      }));

      console.log(
        "[TodoList] Initializing new todo list:",
        todosWithCompletion
      );

      setTodos(todosWithCompletion);
      localStorage.setItem("todos", JSON.stringify(todosWithCompletion));
    } catch (error) {
      console.error("[TodoList] Error initializing todo list:", error);
      toast({
        title: "Error",
        description: "Failed to generate todo list. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "low":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getProgressColor = (impact: number) => {
    if (impact >= 8) return "bg-rose-500";
    if (impact >= 5) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const parseNextAction = (
    nextActions: string
  ): { url: string | null; payload: any } => {
    // Initialize result
    const result = {
      url: null as string | null,
      payload: {
        source: "todo" // Set default source
      } as any,
    };

    try {
      // First try to extract the entire URL pattern (including query parameters)
      const urlMatch = nextActions.match(/payment[^?\s]*/i);
      if (!urlMatch) {
        return result;
      }

      // Set the base URL
      result.url = "/payment";

      // Extract query parameters if they exist
      const queryMatch = nextActions.match(/\?([^?\s]*)/);
      if (queryMatch) {
        const queryString = queryMatch[1];
        const searchParams = new URLSearchParams(queryString);

        searchParams.forEach((value, key) => {
          // Convert snake_case to camelCase
          const camelKey = key
            .toLowerCase()
            .replace(/([-_][a-z])/g, (group) =>
              group.replace("-", "").replace("_", "").toUpperCase()
            );

          // Try to parse value as number if possible
          const numValue = Number(value);
          if (!isNaN(numValue) && key.includes("amount")) {
            result.payload[camelKey] = numValue;
          } else {
            // Clean up string values
            result.payload[camelKey] = value
              .replace(/_/g, " ")
              .replace(/([A-Z])/g, " $1")
              .trim();
          }
        });
      }

      // If no query parameters found, try to extract JSON payload
      if (Object.keys(result.payload).length === 1) {
        const payloadMatch = nextActions.match(/\{[^}]+\}/);
        if (payloadMatch) {
          try {
            const jsonPayload = JSON.parse(payloadMatch[0]);
            result.payload = {
              ...result.payload, // Keep the source
              ...jsonPayload,
              amount:
                typeof jsonPayload.amount === "number" ? jsonPayload.amount : 0,
              transTitle: jsonPayload.transTitle || "Payment",
            };
          } catch (e) {
            console.warn("Failed to parse payload JSON:", e);
          }
        }
      }

      // Extract title and amount from text if not found in query or JSON
      if (!result.payload.transTitle) {
        const titleMatch = nextActions.match(/title[:\s]+([^,\n\r]+)/i);
        result.payload.transTitle = titleMatch
          ? titleMatch[1].trim()
          : "Payment";
      }

      if (!result.payload.amount || typeof result.payload.amount !== "number") {
        const amountMatch = nextActions.match(/amount[:\s]+(\d+(\.\d+)?)/i);
        result.payload.amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      }

      // Validate required fields
      if (
        !result.payload.transTitle ||
        typeof result.payload.amount !== "number"
      ) {
        return {
          url: null,
          payload: { source: "todo" },
        };
      }
    } catch (error) {
      console.error("Error parsing next actions:", error);
      return {
        url: null,
        payload: { source: "todo" },
      };
    }

    return result;
  };

  const handleNextAction = (nextActions: string, todoId: string) => {
    const { url, payload } = parseNextAction(nextActions);

    if (!url || !payload.transTitle || typeof payload.amount !== "number") {
      toast({
        variant: "destructive",
        title: "Invalid Payment Information",
        description:
          "Unable to process payment details. Please check the format.",
      });
      return;
    }

    try {
      // Keep original format with underscores
      const searchParams = new URLSearchParams({
        trans_title: payload.transTitle.replace(/\s+/g, "_"),
        amount: String(payload.amount),
        source: "todo",
        todo_id: todoId,
      });

      console.log(
        "[TodoList] Navigating with params:",
        searchParams.toString()
      );

      navigate(`${url}?${searchParams.toString()}`);
    } catch (error) {
      console.error("[TodoList] Navigation error:", error);
      toast({
        variant: "destructive",
        title: "Navigation Error",
        description: "Unable to proceed to payment gateway. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Financial Todo List
        </h1>
        <Badge variant="outline" className="px-4 py-1">
          {todos.filter((todo) => todo.completed).length}/{todos.length}{" "}
          Completed
        </Badge>
      </div>

      <div className="grid gap-6">
        {currentTasks.map((todo) => (
          <Dialog key={todo.id}>
            <DialogTrigger asChild>
              <Card
                className={`group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer ${
                  todo.completed
                    ? "bg-slate-50 dark:bg-slate-900/50"
                    : "bg-white dark:bg-slate-900"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTodoCompletion(todo.id);
                      }}
                    >
                      <Checkbox checked={todo.completed} className="mt-1.5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`text-xl font-semibold transition-colors ${
                              todo.completed
                                ? "line-through text-muted-foreground"
                                : ""
                            }`}
                          >
                            {todo.title}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {todo.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(todo.priority)}`}
                        >
                          {todo.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <IconCalendar className="h-4 w-4" />
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                        <div className="flex-1 flex items-center gap-3">
                          <Progress
                            value={todo.impact * 10}
                            className={`${getProgressColor(todo.impact)} h-2`}
                          />
                          <span className="text-sm text-muted-foreground whitespace-nowrap">
                            Impact: {todo.impact}/10
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl">{todo.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-muted-foreground">{todo.description}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconCalendar className="h-4 w-4" />
                      <span className="text-sm">Due Date</span>
                    </div>
                    <p>{new Date(todo.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconCategory className="h-4 w-4" />
                      <span className="text-sm">Category</span>
                    </div>
                    <p className="capitalize">{todo.category}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconAlertCircle className="h-4 w-4" />
                      <span className="text-sm">Priority</span>
                    </div>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(todo.priority)}
                    >
                      {todo.priority}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconChartBar className="h-4 w-4" />
                      <span className="text-sm">Impact Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={todo.impact * 10}
                        className={getProgressColor(todo.impact)}
                      />
                      <span className="text-sm font-medium">
                        {todo.impact}/10
                      </span>
                    </div>
                  </div>
                </div>
                {todo.next_actions &&
                  (() => {
                    const { url, payload } = parseNextAction(todo.next_actions);
                    if (
                      url &&
                      Object.keys(payload).length > 0 &&
                      payload.amount > 0
                    ) {
                      return (
                        <div className="space-y-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">Payment Required</h4>
                            <Badge variant="secondary" className="font-medium">
                              {payload.amount
                                ? `RM ${Number(payload.amount).toLocaleString(
                                    "en-MY",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}`
                                : "Amount Pending"}
                            </Badge>
                          </div>
                          <div className="rounded-lg border bg-card p-4 text-card-foreground">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">
                                {payload.transTitle}
                              </div>
                              <Button
                                onClick={() =>
                                  handleNextAction(todo.next_actions, todo.id)
                                }
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <IconCreditCard className="mr-2 h-4 w-4" />
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="pt-4 border-t">
                        <Button
                          onClick={() =>
                            handleNextAction(todo.next_actions, todo.id)
                          }
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Pay Now
                        </Button>
                      </div>
                    );
                  })()}
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="icon"
          className="h-10 w-10"
        >
          <IconPlayerTrackPrevFilled className="h-4 w-4" />
        </Button>
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          variant="outline"
          size="icon"
          className="h-10 w-10"
        >
          <IconPlayerTrackNextFilled className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TodoList;
