import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProfileData } from "@/types/profile";

type Consents = NonNullable<ProfileData["consents"]>;

interface ConsentFormProps {
  consents: Consents;
  isEditing: boolean;
  onConsentChange: (field: keyof Consents) => (checked: boolean) => void;
  onBankToggle: (bank: string) => void;
}

const banksList = [
  "CIMB Bank",
  "Hong Leong Bank",
  "Maybank",
  "Public Bank",
  "RHB Bank",
  "Touch N Go E-wallet",
  "Boost E-Wallet",
  "GxB Bank",
  "Setel App",
];

const ConsentForm: React.FC<ConsentFormProps> = ({
  consents,
  isEditing,
  onConsentChange,
  onBankToggle,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Consent Management</CardTitle>
        <CardDescription>
          Please select which information you consent to share
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {banksList.map((bank) => (
                <div key={bank} className="flex items-center space-x-2">
                  <Checkbox
                    id={bank}
                    checked={consents.banks.includes(bank)}
                    onCheckedChange={() => onBankToggle(bank)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor={bank}>{bank}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Other Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ssm"
                  checked={consents.ssm}
                  onCheckedChange={(checked) =>
                    onConsentChange("ssm")(checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="ssm">SSM Information</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="courtRecords"
                  checked={consents.courtRecords}
                  onCheckedChange={(checked) =>
                    onConsentChange("courtRecords")(checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="courtRecords">Court Records</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dcheqs"
                  checked={consents.dcheqs}
                  onCheckedChange={(checked) =>
                    onConsentChange("dcheqs")(checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="dcheqs">DCHEQS Information</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tradeReferees"
                  checked={consents.tradeReferees}
                  onCheckedChange={(checked) =>
                    onConsentChange("tradeReferees")(checked as boolean)
                  }
                  disabled={!isEditing}
                />
                <Label htmlFor="tradeReferees">Trade Referees</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentForm;
