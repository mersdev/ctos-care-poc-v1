import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DishonouredCheque {
  date: string;
  amount: number;
  bank: string;
  reason: string;
}

interface DishonouredChequesProps {
  data?: DishonouredCheque[];
}

const DishonouredCheques: React.FC<DishonouredChequesProps> = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dishonoured Cheques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No dishonoured cheques found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dishonoured Cheques</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Bank</th>
                <th className="text-left py-2">Amount (RM)</th>
                <th className="text-left py-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cheque, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2">{cheque.date}</td>
                  <td className="py-2">{cheque.bank}</td>
                  <td className="py-2">{cheque.amount.toLocaleString()}</td>
                  <td className="py-2">{cheque.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DishonouredCheques;
