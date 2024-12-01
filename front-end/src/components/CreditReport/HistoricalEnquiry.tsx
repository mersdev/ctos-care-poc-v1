import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Enquiry {
  date: string;
  enquirer: string;
  purpose: string;
}

interface HistoricalEnquiryProps {
  data?: Enquiry[];
}

const HistoricalEnquiry: React.FC<HistoricalEnquiryProps> = ({ data = [] }) => {
  if (!data.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Historical Enquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No historical enquiries found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historical Enquiries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Enquirer</th>
                <th className="text-left py-2">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {data.map((enquiry, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-2">{enquiry.date}</td>
                  <td className="py-2">{enquiry.enquirer}</td>
                  <td className="py-2">{enquiry.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalEnquiry;
