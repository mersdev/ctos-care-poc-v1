import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TradeReferee } from '@/types/creditReport';

interface TradeRefereeListingProps {
  data?: TradeReferee[];
}

const TradeRefereeListing: React.FC<TradeRefereeListingProps> = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade References</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No trade references available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade References</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((referee, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">{referee.company}</h3>
                <span className={`px-2 py-1 rounded text-sm ${
                  referee.rating === 'A' ? 'bg-green-100 text-green-800' :
                  referee.rating === 'B' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Rating: {referee.rating}
                </span>
              </div>
              <p className="text-muted-foreground">{referee.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeRefereeListing;
