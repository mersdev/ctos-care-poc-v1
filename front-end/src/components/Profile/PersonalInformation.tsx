import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Flag,
  CreditCard,
} from "lucide-react";
import sampleMyKad from "/assets/sample-mykad.png";
import { ProfileData } from "@/types/profile";

interface PersonalInformationProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
  isEditing: boolean;
  isProcessing: boolean;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => Promise<void>;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  profileData,
  setProfileData,
  isEditing,
  isProcessing,
  handleImageUpload,
}) => {
  const handleInputChange =
    (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Please provide your personal details or upload your MyKad for
          automatic information extraction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <h3 className="text-lg font-semibold mb-2">
                Upload Identity Card
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload your MyKad to automatically fill in your information
              </p>
              <div>
                <input
                  type="file"
                  id="myKadInput"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageUpload(e);
                    }
                  }}
                  accept="image/*"
                />
                <Button
                  type="button"
                  onClick={() => {
                    const fileInput = document.getElementById('myKadInput') as HTMLInputElement;
                    fileInput?.click();
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload MyKad
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src={sampleMyKad}
                alt="Sample MyKad"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Full Name</span>
              </label>
              <Input
                value={profileData.name || ""}
                onChange={handleInputChange("name")}
                disabled={true}
                placeholder="Tan Chee Kiang"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </label>
              <Input
                value={profileData.email || ""}
                onChange={handleInputChange("email")}
                disabled={true}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>Phone Number</span>
              </label>
              <Input
                value={profileData.phone || ""}
                onChange={handleInputChange("phone")}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>Identity Card Number</span>
              </label>
              <Input
                value={profileData.identity_card_number || ""}
                onChange={handleInputChange("identity_card_number")}
                disabled={true}
                placeholder="850122-07-4533"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Date of Birth</span>
              </label>
              <Input
                value={profileData.date_of_birth || ""}
                onChange={handleInputChange("date_of_birth")}
                disabled={true}
                placeholder="DD-MM-YYYY"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <Flag className="w-4 h-4" />
                <span>Nationality</span>
              </label>
              <Input
                value={profileData.nationality || ""}
                onChange={handleInputChange("nationality")}
                disabled={true}
                placeholder="Malaysia"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Address</span>
              </label>
              <Input
                value={profileData.address || ""}
                onChange={handleInputChange("address")}
                disabled={true}
                placeholder="11, Jalan Dato Onn, Kuala Lumpur, 50480 Kuala Lumpur, Wilayah Persekutuan"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformation;
