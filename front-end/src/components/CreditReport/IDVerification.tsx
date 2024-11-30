import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IDVerificationData {
  name?: string;
  icNo?: string;
  dob?: string;
  nationality?: string;
  address?: string;
}

interface IDVerificationProps {
  data?: IDVerificationData;
}

const IDVerification: React.FC<IDVerificationProps> = ({ data = {} }) => {
  const {
    name = "Not Available",
    icNo = "Not Available",
    dob = "Not Available",
    nationality = "Not Available",
    address = "Not Available",
  } = data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium">Full Name</p>
            <p className="text-base">{name}</p>
          </div>
          <div>
            <p className="text-sm font-medium">IC Number</p>
            <p className="text-base">{icNo}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Date of Birth</p>
            <p className="text-base">{dob}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Nationality</p>
            <p className="text-base">{nationality}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Address</p>
            <p className="text-base">{address}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IDVerification;
