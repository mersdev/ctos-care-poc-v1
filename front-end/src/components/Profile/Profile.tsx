import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { extractInfoFromImage } from "@/services/ollamaService";
import {
  Loader2,
  Info,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Flag,
  CreditCard,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import sampleMyKad from "/assets/sample-mykad.png";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  identityCardNumber: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    phone: "",
    identityCardNumber: "",
    dateOfBirth: "",
    address: "",
    nationality: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      toast({
        title: "Processing Image",
        description: "Please wait while we extract information from your IC...",
        variant: "default",
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          const base64Data = base64Image.split(",")[1];

          toast({
            title: "Image Uploaded",
            description: "Successfully uploaded your IC image",
            variant: "default",
          });

          console.log("Sending image data to Ollama...");
          const extractedInfo = await extractInfoFromImage(base64Data);
          console.log("Received response from Ollama:", extractedInfo);

          // Update profile data with extracted info
          setProfileData((prevData) => ({
            ...prevData,
            fullName: extractedInfo.fullName,
            identityCardNumber: extractedInfo.identityCardNumber,
            dateOfBirth: extractedInfo.dateOfBirth,
            address: extractedInfo.address,
            nationality: extractedInfo.nationality,
          }));

          toast({
            title: "Information Extracted",
            description: "Successfully extracted information from your IC",
            variant: "default",
          });
        } catch (error) {
          console.error("Error in image processing:", error);
          toast({
            title: "Extraction Failed",
            description:
              error instanceof Error
                ? error.message
                : "Failed to extract information from identity card. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        console.error("Error reading file");
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to read the image file",
          variant: "destructive",
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process the image",
        variant: "destructive",
      });
    }
  };

  const handleInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully",
      variant: "default",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information and contact details
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEditClick}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Extracting Information...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Upload Identity Card
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="bg-muted/50 p-6 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-5 w-5" />
                  <h3 className="font-medium">Sample Identity Card Format</h3>
                </div>
                <img
                  src={sampleMyKad}
                  alt="Sample Malaysian Identity Card"
                  className="rounded-lg border border-border shadow-sm max-w-md mx-auto"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                value={profileData.fullName}
                placeholder="Full Name (from IC)"
                readOnly
                className={
                  !profileData.fullName ? "bg-muted/50" : "bg-muted/30"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Identity Card Number
              </label>
              <Input
                value={profileData.identityCardNumber}
                placeholder="IC Number (from IC)"
                readOnly
                className={
                  !profileData.identityCardNumber
                    ? "bg-muted/50"
                    : "bg-muted/30"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Address
              </label>
              <Input
                value={profileData.address}
                placeholder="Address (from IC)"
                readOnly
                className={!profileData.address ? "bg-muted/50" : "bg-muted/30"}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date of Birth
              </label>
              <Input
                value={profileData.dateOfBirth}
                placeholder="Date of Birth (from IC)"
                readOnly
                className={
                  !profileData.dateOfBirth ? "bg-muted/50" : "bg-muted/30"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                Nationality
              </label>
              <Input
                value={profileData.nationality}
                placeholder="Nationality (from IC)"
                readOnly
                className={
                  !profileData.nationality ? "bg-muted/50" : "bg-muted/30"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </label>
              <Input
                type="email"
                value={profileData.email}
                onChange={handleInputChange("email")}
                placeholder="Enter your email"
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </label>
              <Input
                value={profileData.phone}
                onChange={handleInputChange("phone")}
                placeholder="Enter your phone number"
                disabled={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="w-32"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="w-32">
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
