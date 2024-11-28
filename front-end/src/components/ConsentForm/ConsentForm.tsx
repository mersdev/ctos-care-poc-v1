import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConsentData {
  banks: string[];
  ssm: boolean;
  courtRecords: boolean;
  dcheqs: boolean;
  tradeReferees: boolean;
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

const ConsentForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [consentData, setConsentData] = useState<ConsentData>({
    banks: [],
    ssm: false,
    courtRecords: false,
    dcheqs: false,
    tradeReferees: false,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBankChange = (bank: string) => {
    setConsentData((prev) => ({
      ...prev,
      banks: prev.banks.includes(bank)
        ? prev.banks.filter((b) => b !== bank)
        : [...prev.banks, bank],
    }));
  };

  const validateConsent = () => {
    const hasBank = consentData.banks.length > 0;
    const hasAllOtherSources =
      consentData.ssm &&
      consentData.courtRecords &&
      consentData.dcheqs &&
      consentData.tradeReferees;
    return { hasBank, hasAllOtherSources };
  };

  const handleSave = () => {
    const { hasBank, hasAllOtherSources } = validateConsent();
    
    // Show warning if not all consents are given
    if (!hasAllOtherSources || !hasBank) {
      toast({
        title: "Limited Data Access",
        description: "Consenting to all data sources will provide better financial insights and recommendations.",
        variant: "warning",
      });
    }

    // Always save the preferences
    setIsSuccess(true);
    setShowDialog(true);
    toast({
      title: "Success",
      description: "Your data consent preferences have been saved successfully.",
      variant: "default",
    });
    
    // Redirect to dashboard after 1.5 seconds
    setTimeout(() => {
      navigate('/');
      setShowDialog(false);
    }, 1500);
  };

  const handleUpdate = () => {
    setShowDialog(false);
    toast({
      title: "Recommendation",
      description: "Consider providing all consents for better financial insights and recommendations.",
      variant: "warning",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Consent Form</h1>

      {/* Banks and E-Wallets */}
      <Card className="mb-6 bank-section">
        <CardHeader>
          <CardTitle>Banks and E-Wallets</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banksList.map((bank) => (
            <div key={bank} className="flex items-center space-x-2">
              <Checkbox
                id={bank}
                checked={consentData.banks.includes(bank)}
                onCheckedChange={() => handleBankChange(bank)}
              />
              <label htmlFor={bank} className="text-sm font-medium">
                {bank}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Other Data Sources */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Other Data Sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ssm"
              checked={consentData.ssm}
              onCheckedChange={(checked) =>
                setConsentData((prev) => ({ ...prev, ssm: checked as boolean }))
              }
            />
            <label htmlFor="ssm" className="text-sm font-medium">
              Companies Commission of Malaysia (SSM)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="court"
              checked={consentData.courtRecords}
              onCheckedChange={(checked) =>
                setConsentData((prev) => ({
                  ...prev,
                  courtRecords: checked as boolean,
                }))
              }
            />
            <label htmlFor="court" className="text-sm font-medium">
              Court Records
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="dcheqs"
              checked={consentData.dcheqs}
              onCheckedChange={(checked) =>
                setConsentData((prev) => ({
                  ...prev,
                  dcheqs: checked as boolean,
                }))
              }
            />
            <label htmlFor="dcheqs" className="text-sm font-medium">
              DCHEQS System (Dishonored Checks)
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="trade"
              checked={consentData.tradeReferees}
              onCheckedChange={(checked) =>
                setConsentData((prev) => ({
                  ...prev,
                  tradeReferees: checked as boolean,
                }))
              }
            />
            <label htmlFor="trade" className="text-sm font-medium">
              Trade Referees
            </label>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full py-6" size="lg">
        Save Consent Preferences
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSuccess
                ? "Thank you for your consent!"
                : "Consider Full Consent"}
            </DialogTitle>
            <DialogDescription>
              {isSuccess
                ? "Your data consent preferences have been saved successfully. We'll use this information to provide you with better financial insights."
                : "For the best financial insights and recommendations, consider consenting to all data sources. This helps us provide more accurate and comprehensive analysis."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            {isSuccess ? (
              <Button onClick={() => setShowDialog(false)} size="lg">
                Close
              </Button>
            ) : (
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false);
                  }}
                  size="lg"
                >
                  Keep Current Selection
                </Button>
                <Button 
                  onClick={handleUpdate}
                  size="lg"
                >
                  Update Selections
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsentForm;
