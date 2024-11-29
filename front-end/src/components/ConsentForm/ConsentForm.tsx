import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { ConsentData } from "@/types/profile";
import { ProfileService } from "@/services/profileService";

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
  const [searchParams] = useSearchParams();
  const isSetup = searchParams.get('setup') === 'true';
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [consentData, setConsentData] = useState<ConsentData>({
    banks: [],
    ssm: false,
    courtRecords: false,
    dcheqs: false,
    tradeReferees: false,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        if (profile?.consents) {
          setConsentData(profile.consents);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load consent data',
        });
      }
    };

    if (!isSetup) {
      loadProfile();
    }
  }, [isSetup, toast]);

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

  const handleSave = async () => {
    const { hasBank, hasAllOtherSources } = validateConsent();
    
    if (isSetup && (!hasAllOtherSources || !hasBank)) {
      toast({
        variant: "destructive",
        title: "Required Consents",
        description: "Please consent to all data sources to proceed.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Get current profile first
      const currentProfile = await ProfileService.getProfile();
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      // Update profile with new consent data
      const updatedProfile = {
        ...currentProfile,
        consents: consentData,
        onboardingCompleted: isSetup ? true : currentProfile.onboardingCompleted,
      };

      await ProfileService.updateProfile(updatedProfile);

      setIsSuccess(true);
      setShowDialog(true);
      
      toast({
        title: "Success",
        description: isSetup 
          ? "Setup completed! Redirecting to dashboard..." 
          : "Your data consent preferences have been saved successfully.",
      });
      
      // Redirect after successful save
      setTimeout(() => {
        navigate(isSetup ? '/dashboard' : '/');
        setShowDialog(false);
      }, 1500);
    } catch (error) {
      console.error('Error saving consents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save consent preferences",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Data Consent Settings</CardTitle>
          <CardDescription>
            {isSetup 
              ? "Please provide necessary consents to complete your account setup"
              : "Manage your data sharing preferences"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bank Account Information</h3>
            <p className="text-sm text-muted-foreground">
              Select the banks you want to share information from:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banksList.map((bank) => (
                <div key={bank} className="flex items-center space-x-2">
                  <Checkbox
                    id={bank}
                    checked={consentData.banks.includes(bank)}
                    onCheckedChange={() => handleBankChange(bank)}
                  />
                  <label
                    htmlFor={bank}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {bank}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Data Sources</h3>
            <p className="text-sm text-muted-foreground">
              Select additional sources to enhance your financial profile:
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ssm"
                  checked={consentData.ssm}
                  onCheckedChange={(checked) =>
                    setConsentData((prev) => ({ ...prev, ssm: checked as boolean }))
                  }
                />
                <label
                  htmlFor="ssm"
                  className="text-sm font-medium leading-none"
                >
                  Companies Commission of Malaysia (SSM)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="courtRecords"
                  checked={consentData.courtRecords}
                  onCheckedChange={(checked) =>
                    setConsentData((prev) => ({
                      ...prev,
                      courtRecords: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="courtRecords"
                  className="text-sm font-medium leading-none"
                >
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
                <label
                  htmlFor="dcheqs"
                  className="text-sm font-medium leading-none"
                >
                  Dishonoured Cheques Information System (DCHEQS)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tradeReferees"
                  checked={consentData.tradeReferees}
                  onCheckedChange={(checked) =>
                    setConsentData((prev) => ({
                      ...prev,
                      tradeReferees: checked as boolean,
                    }))
                  }
                />
                <label
                  htmlFor="tradeReferees"
                  className="text-sm font-medium leading-none"
                >
                  Trade Referees
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isSuccess ? "Success!" : "Warning"}
            </DialogTitle>
            <DialogDescription>
              {isSuccess
                ? "Your preferences have been saved successfully."
                : "Limited data access may affect the quality of our services."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsentForm;
