import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CCRISDerivativesProps {
  data?: {
    items: Array<{
      type: string;
      details: string;
    }>;
  };
}

const CCRISDerivatives: React.FC<CCRISDerivativesProps> = ({ data }) => {
  if (!data?.items?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>CCRIS Derivatives</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No CCRIS derivatives available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>CCRIS Derivatives</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold text-lg">{item.type}</h3>
              <p className="text-muted-foreground">{item.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CCRISDerivatives;
