import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AMLAProps {
  data: {
    inquiries: number;
    matches: Array<{
      name: string;
      icNumber: string;
    }>;
  };
}

const AMLA: React.FC<AMLAProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AMLA Status</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Total inquiries: {data.inquiries}
        </p>
        
        {data.matches.length > 0 ? (
          <div className="space-y-4">
            <h3 className="font-semibold">Potential Matches</h3>
            {data.matches.map((match, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <p className="font-medium">{match.name}</p>
                <p className="text-sm text-muted-foreground">IC: {match.icNumber}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-600">No matches found in AMLA database.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AMLA;
