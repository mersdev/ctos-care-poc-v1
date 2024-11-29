import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LegalCase {
  caseNumber: string;
  plaintiff: string;
  details: string;
  status: string;
}

interface LegalCasesDefendantProps {
  data?: LegalCase[];
}

const LegalCasesDefendant: React.FC<LegalCasesDefendantProps> = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Legal Cases (as Defendant)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No legal cases found where you are the defendant.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Cases (as Defendant)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((legalCase, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">Case #{legalCase.caseNumber}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  legalCase.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                  legalCase.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {legalCase.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Plaintiff: {legalCase.plaintiff}</p>
              <p className="text-muted-foreground">{legalCase.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalCasesDefendant;
