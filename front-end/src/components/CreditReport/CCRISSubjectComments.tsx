import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CCRISSubjectCommentsProps {
  data?: {
    comments: string[];
  };
}

const CCRISSubjectComments: React.FC<CCRISSubjectCommentsProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>CCRIS Subject Comments</CardTitle>
      </CardHeader>
      <CardContent>
        {data?.comments?.length ? (
          <ul className="list-disc list-inside space-y-2">
            {data.comments.map((comment, index) => (
              <li key={index} className="text-muted-foreground">{comment}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No CCRIS subject comments available.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CCRISSubjectComments;
