import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { IconCreditCard } from "@tabler/icons-react";

interface PaymentDetails {
  trans_title: string;
  amount: number;
  todoId: string;
  source?: string;
}

const PaymentGateway: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const trans_title = searchParams.get("trans_title")?.replace(/_/g, " ");
      const amount = searchParams.get("amount");
      const todoId = searchParams.get("todo_id");
      const source = searchParams.get("source") || undefined;

      if (!trans_title || !amount || !todoId) {
        const missingFields = [];
        if (!trans_title) missingFields.push("transaction title");
        if (!amount) missingFields.push("amount");
        if (!todoId) missingFields.push("todo ID");

        throw new Error(
          `Missing required payment details: ${missingFields.join(", ")}`
        );
      }

      // Validate amount is a valid number
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid payment amount");
      }

      setPaymentDetails({
        trans_title,
        amount: parsedAmount,
        todoId,
        source,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Invalid payment details";
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Error parsing payment details:", err);
    }
  }, [location, toast]);

  const handlePayment = async () => {
    if (!paymentDetails) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update todo completion status in localStorage
      const savedTodos = localStorage.getItem("todos");
      if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        const updatedTodos = todos.map((todo: any) =>
          todo.id === paymentDetails.todoId
            ? { ...todo, completed: true }
            : todo
        );
        localStorage.setItem("todos", JSON.stringify(updatedTodos));

        console.log("[PaymentGateway] Updated todo completion status:", {
          todoId: paymentDetails.todoId,
          completed: true,
        });
      }

      // Show success toast
      toast({
        title: "Payment Successful",
        description: `Successfully paid RM${paymentDetails.amount} for ${paymentDetails.trans_title}`,
      });

      // Navigate back to TodoList
      navigate("/todo", {
        state: {
          paymentSuccess: true,
          message: `Successfully paid RM${paymentDetails.amount} for ${paymentDetails.trans_title}`,
        },
      });
    } catch (err) {
      toast({
        title: "Payment Failed",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  if (!paymentDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">
                Invalid Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => navigate("/todo")}>
                Return to Todo List
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex flex-col items-center space-y-2">
              <IconCreditCard size={32} className="text-violet-700" />
              <CardTitle>Payment Gateway</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Transaction</p>
              <p className="text-2xl font-semibold">
                {paymentDetails.trans_title}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-semibold">
                RM {paymentDetails.amount.toFixed(2)}
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Pay Now"
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/todo")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentGateway;
