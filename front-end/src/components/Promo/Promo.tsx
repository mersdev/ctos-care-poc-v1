import React, { useEffect, useState } from 'react';
import { CreditCard, Loan } from '@/types/api';
import { OllamaPromotionService } from '@/services/ollamaPromotionService';
import { fetchTransactions } from '@/api/promotionApi';
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IconChevronRight, IconInfoCircle } from "@tabler/icons-react";

interface PromoProps {
  creditScore: number;
  monthlyIncome: number;
}

const Promo: React.FC<PromoProps> = ({ creditScore, monthlyIncome }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);

  useEffect(() => {
    let isSubscribed = true;

    const initializePromo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize the OllamaPromotionService
        const service = OllamaPromotionService.getInstance();
        await service.initialize();

        // Fetch transactions
        const transactionData = await fetchTransactions();

        // Only update state if component is still mounted
        if (!isSubscribed) return;

        // Get recommendations
        const [loanRecs, cardRecs] = await Promise.all([
          OllamaPromotionService.generateLoanRecommendations({
            creditScore,
            monthlyIncome,
            transactions: transactionData,
          }),
          OllamaPromotionService.generateCreditCardRecommendations({
            creditScore,
            monthlyIncome,
            transactions: transactionData,
          }),
        ]);

        if (!isSubscribed) return;

        setLoans(loanRecs);
        setCreditCards(cardRecs);
      } catch (err) {
        if (!isSubscribed) return;
        console.error('Error initializing promo:', err);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        if (!isSubscribed) return;
        setLoading(false);
      }
    };

    initializePromo();

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [creditScore, monthlyIncome]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="loans" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="loans">Loan Recommendations</TabsTrigger>
        <TabsTrigger value="credit-cards">Credit Card Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="loans" className="mt-6 space-y-6">
        {loans.map((loan) => (
          <Card key={loan.loan_name} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{loan.loan_name}</h3>
                <div className="text-sm text-muted-foreground">
                  Interest Rate: {loan.details.interest_rate}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Apply Now <IconChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Minimum Amount</div>
                <div className="text-sm text-muted-foreground">
                  {loan.details.minimum_amount}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Early Termination Fee</div>
                <div className="text-sm text-muted-foreground">
                  {loan.details.early_termination_fee}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start space-x-2">
              <IconInfoCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{loan.analysis.summary}</p>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium">Key Benefits</div>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {loan.analysis.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="credit-cards" className="mt-6 space-y-6">
        {creditCards.map((card) => (
          <Card key={card.card_name} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{card.card_name}</h3>
                <div className="text-sm text-muted-foreground">
                  Minimum Income: {card.details.minimum_income}
                </div>
              </div>
              <Button variant="outline" size="sm">
                Apply Now <IconChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {card.details.image_url && (
              <div className="mt-4">
                <img
                  src={card.details.image_url}
                  alt={card.card_name}
                  className="h-40 w-64 object-contain"
                />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium">Annual Fee</div>
                <div className="text-sm text-muted-foreground">
                  {card.details.annual_fee}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Cashback</div>
                <div className="text-sm text-muted-foreground">
                  {card.details.cashback}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start space-x-2">
              <IconInfoCircle className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{card.analysis.summary}</p>
            </div>

            <div className="mt-4">
              <div className="text-sm font-medium">Key Benefits</div>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {card.analysis.advantages.map((advantage, index) => (
                  <li key={index}>{advantage}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export default Promo;
