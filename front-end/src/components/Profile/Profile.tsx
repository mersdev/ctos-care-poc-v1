import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { profileApi } from "@/api/authApi";
import { useAuthContext } from "@/contexts/AuthContext";
import { ProfileData, ProfileRequest } from "@/types/profile";
import { extractInfoFromImage } from "@/services/ollamaService";
import { KeyManagementService } from "@/services/keyManagementService";
import PersonalInformation from "./PersonalInformation";
import ConsentForm from "./ConsentForm";

type Consents = NonNullable<ProfileData["consents"]>;

const defaultConsents: Consents = {
  banks: [],
  ssm: true,
  courtRecords: true,
  dcheqs: true,
  tradeReferees: true,
};

const Profile: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isSetup = searchParams.get("setup") === "true";
  const [isEditing, setIsEditing] = useState(isSetup);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuthContext();
  const [profileData, setProfileData] = useState<ProfileData>({
    email: user?.email || "",
    encrypted_data: "",
    encryption_enabled: true,
    consents: defaultConsents,
    name: "",
    identity_card_number: "",
    date_of_birth: "",
    address: "",
    nationality: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleConsentChange = (field: keyof Consents) => (checked: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      consents: {
        ...(prev.consents || defaultConsents),
        [field]: checked,
      },
    }));
  };

  const handleBankToggle = (bank: string) => {
    setProfileData((prev) => {
      const currentConsents = prev.consents || defaultConsents;
      const currentBanks = currentConsents.banks;
      const updatedBanks = currentBanks.includes(bank)
        ? currentBanks.filter((b) => b !== bank)
        : [...currentBanks, bank];

      return {
        ...prev,
        consents: {
          ...currentConsents,
          banks: updatedBanks,
        },
      };
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const profile = await profileApi.getProfile();
        const privateKey = KeyManagementService.get_private_key();

        if (profile && profile.encrypted_data && privateKey) {
          const decryptedData = await KeyManagementService.decrypt_profile_data(
            profile.encrypted_data,
            privateKey
          );

          setProfileData({
            ...decryptedData,
            email: user?.email || profile.email,
            encrypted_data: profile.encrypted_data,
            encryption_enabled: true,
            public_key: profile.public_key,
            consents: profile.consents || defaultConsents,
          });
          setIsEditing(false);
        } else {
          setProfileData({
            email: user?.email || "",
            encrypted_data: "",
            encryption_enabled: true,
            consents: defaultConsents,
          });
          setIsEditing(isSetup);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfileData({
          email: user?.email || "",
          encrypted_data: "",
          encryption_enabled: true,
          consents: defaultConsents,
        });
        setIsEditing(isSetup);
      }
    };

    fetchProfile();
  }, [user?.email, isSetup, user]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type:", file.type);
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const base64Image = e.target?.result as string;
          if (!base64Image) {
            throw new Error("Failed to read image file");
          }

          const extractedInfo = await extractInfoFromImage(base64Image);
          setProfileData((prev) => ({
            ...prev,
            name: extractedInfo.full_name,
            identity_card_number: extractedInfo.identity_card_number,
            date_of_birth: extractedInfo.date_of_birth,
            address: extractedInfo.address,
            nationality: extractedInfo.nationality,
            // Store the original data as encrypted_data for submission
            encrypted_data: JSON.stringify({
              name: extractedInfo.full_name,
              identity_card_number: extractedInfo.identity_card_number,
              date_of_birth: extractedInfo.date_of_birth,
              address: extractedInfo.address,
              nationality: extractedInfo.nationality,
            }),
          }));
        } catch (error) {
          console.error("Error processing image:", error);
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setIsProcessing(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in handleImageUpload:", error);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileData.consents?.banks.length) return;

    setIsSaving(true);
    try {
      const publicKey = KeyManagementService.get_public_key();
      if (!publicKey) {
        throw new Error("Public key not found");
      }

      console.log("Profile Data:", profileData);

      // Encrypt the profile data
      const encryptedData = await KeyManagementService.encrypt_profile_data(
        profileData,
        publicKey
      );

      // Prepare the profile request according to the ProfileRequest interface
      const profileRequest: ProfileRequest = {
        email: profileData.email,
        encrypted_data: encryptedData,
        encryption_enabled: true,
        public_key: publicKey,
        consents: profileData.consents || defaultConsents,
      };

      // Create or update the profile
      const updatedProfile = await (profileData.id
        ? profileApi.updateProfile(profileRequest)
        : profileApi.createProfile(profileRequest));

      // Update the local state with the response
      setProfileData((prev) => ({
        ...prev,
        ...updatedProfile,
      }));

      setIsEditing(false);

      if (isSetup) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (isSetup) {
      navigate("/login");
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-2 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isSetup ? "Complete Your Profile" : "Profile"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PersonalInformation
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            isProcessing={isProcessing}
            handleImageUpload={handleImageUpload}
          />

          <ConsentForm
            consents={profileData.consents || defaultConsents}
            onConsentChange={handleConsentChange}
            onBankToggle={handleBankToggle}
            isEditing={isEditing}
          />

          <div className="flex justify-end space-x-4 mt-6">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
