import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { ProfileService } from "@/services/profileService";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProfileData } from "@/types/profile";
import sampleMyKad from "/assets/sample-mykad.png";

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";
  const [isEditing, setIsEditing] = useState(isSetup);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthContext();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    identityCardNumber: "",
    dateOfBirth: "",
    nationality: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await ProfileService.getProfile();
        console.log("Fetched profile:", profile);
        if (profile) {
          setProfileData({
            ...profile,
            email: user?.email || profile.email,
          });
          setIsEditing(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (isSetup) {
          setIsEditing(true);
        }
      }
    };

    fetchProfile();
  }, [user?.email, isSetup]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const reader = new FileReader();

      reader.onerror = () => {
        setIsProcessing(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read the image file.",
        });
      };

      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;
          const extractedInfo = await extractInfoFromImage(base64Image);

          setProfileData((prev) => ({
            ...prev,
            name: extractedInfo.fullName || prev.name,
            identityCardNumber:
              extractedInfo.identityCardNumber || prev.identityCardNumber,
            dateOfBirth: extractedInfo.dateOfBirth || prev.dateOfBirth,
            address: extractedInfo.address || prev.address,
            nationality: extractedInfo.nationality || prev.nationality,
          }));

          toast({
            title: "Success",
            description: "Identity card information extracted successfully.",
          });
        } catch (error) {
          console.error("Error processing image:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to process the image.",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      setIsProcessing(false);
      console.error("Error handling image upload:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the image file.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields with type-safe field access
    const requiredFields: (keyof ProfileData)[] = ["name", "email"];
    const missingFields = requiredFields.filter((field) => !profileData[field]);

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in all required fields: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    // Format IC number if present
    if (profileData.identityCardNumber) {
      const formattedIC = profileData.identityCardNumber.replace(/[-\s]/g, "");
      if (formattedIC.length === 12) {
        const updatedProfileData = {
          ...profileData,
          identityCardNumber: `${formattedIC.slice(0, 6)}-${formattedIC.slice(
            6,
            8
          )}-${formattedIC.slice(8)}`,
        };
        setProfileData(updatedProfileData);
      }
    }

    setIsSaving(true);
    try {
      const updatedProfile = await ProfileService.updateProfile({
        ...profileData,
        onboardingCompleted: true,
      });

      setProfileData(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
      if (isSetup) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Profile Settings</CardTitle>
              <CardDescription>
                {isSetup
                  ? "Please complete your profile to continue"
                  : "Manage your personal information and contact details"}
              </CardDescription>
            </div>
            {!isEditing && !isSetup && (
              <Button
                onClick={() => setIsEditing(true)}
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
                  onChange={handleImageUpload}
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
                Full Name *
              </label>
              <Input
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                placeholder="Full Name (as per IC)"
                required
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email *
              </label>
              <Input
                type="email"
                value={profileData.email}
                readOnly
                required
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </label>
              <Input
                value={profileData.phone || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                placeholder="Phone Number"
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Identity Card Number *
              </label>
              <Input
                value={profileData.identityCardNumber || ""}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    identityCardNumber: e.target.value,
                  })
                }
                placeholder="IC Number"
                required
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date of Birth *
              </label>
              <Input
                value={profileData.dateOfBirth || ""}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    dateOfBirth: e.target.value,
                  })
                }
                placeholder="YYYY-MM-DD"
                required
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4 text-muted-foreground" />
                Nationality *
              </label>
              <Input
                value={profileData.nationality || ""}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    nationality: e.target.value,
                  })
                }
                placeholder="Nationality"
                required
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Address *
              </label>
              <Input
                value={profileData.address || ""}
                onChange={(e) =>
                  setProfileData({ ...profileData, address: e.target.value })
                }
                placeholder="Full Address"
                required
                readOnly={!isEditing}
                className={!isEditing ? "bg-muted/50" : ""}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4">
              {!isSetup && (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="min-w-[100px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
