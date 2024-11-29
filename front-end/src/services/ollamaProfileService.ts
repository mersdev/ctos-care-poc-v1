import axios from "axios";

interface ExtractedInfo {
  full_name: string;
  identity_card_number: string;
  date_of_birth: string;
  address: string;
  nationality: string;
}

// Configure axios defaults
const ollamaApi = axios.create({
  baseURL: "http://localhost:11434",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Increased to 60 second timeout
});

const cleanMarkdownText = (text: string): string => {
  return text
    .replace(/[*_]/g, "") // Remove asterisks and underscores
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

const extractJsonFromText = (text: string): Record<string, string> => {
  try {
    // Clean the text first
    const cleanedText = cleanMarkdownText(text);

    // Try to parse the text directly first
    try {
      const parsed = JSON.parse(cleanedText);
      if (parsed.identityCardNumber) {
        parsed.dateOfBirth = extractDOBFromIC(parsed.identityCardNumber);
      }
      return parsed;
    } catch (e) {
      // If direct parsing fails, try to find a JSON object in the text
      const jsonMatch = cleanedText.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.identityCardNumber) {
          parsed.dateOfBirth = extractDOBFromIC(parsed.identityCardNumber);
        }
        return parsed;
      }
    }

    // If no JSON found, try to parse from markdown-style text
    const parsedData: Record<string, string> = {};
    const lines = cleanedText.split("\n");

    for (const line of lines) {
      // Match list items and key-value pairs (without markdown characters)
      const match = line.match(/^[-\s]*([^:]+):\s*(.+?)$/);
      if (match) {
        const [, key, value] = match;
        const normalizedKey = key
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "") // Remove spaces
          .replace(/-/g, ""); // Remove hyphens

        // Map the normalized keys to the expected format
        const keyMap: Record<string, string> = {
          fullname: "fullName",
          identitycardnumber: "identityCardNumber",
          dateofbirth: "dateOfBirth",
          address: "address",
          nationality: "nationality",
        };

        const mappedKey = keyMap[normalizedKey] || normalizedKey;
        parsedData[mappedKey] = value.trim();
      }
    }

    // Extract DOB from IC number if available
    if (parsedData.identityCardNumber) {
      parsedData.dateOfBirth = extractDOBFromIC(parsedData.identityCardNumber);
    }

    if (Object.keys(parsedData).length > 0) {
      return parsedData;
    }

    throw new Error("No valid data found in response");
  } catch (error) {
    console.error("Failed to extract data from text:", error);
    return {};
  }
};

const extractDOBFromIC = (icNumber: string): string => {
  try {
    // Remove any non-numeric characters from the first 6 digits
    const dobDigits = icNumber.replace(/\D/g, "").substring(0, 6);
    if (dobDigits.length !== 6) {
      return "";
    }

    // Extract year, month, and day
    const year = dobDigits.substring(0, 2);
    const month = dobDigits.substring(2, 4);
    const day = dobDigits.substring(4, 6);

    // Convert 2-digit year to 4-digit year
    const currentYear = new Date().getFullYear();
    const century = currentYear - (currentYear % 100);
    const fullYear =
      parseInt(year) +
      (parseInt(year) > currentYear % 100 ? century - 100 : century);

    // Create and format the date
    const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));

    // Validate the date
    if (isNaN(date.getTime())) {
      return "";
    }

    // Format the date as DD-MM-YYYY
    return `${day}-${month}-${fullYear}`;
  } catch (error) {
    console.error("Error extracting DOB from IC:", error);
    return "";
  }
};

const sanitizeBase64Image = (base64String: string): string => {
  try {
    // Remove data URL prefix if present
    const base64Data = base64String.replace(
      /^data:image\/[a-zA-Z+]+;base64,/,
      ""
    );

    // Basic validation of base64 string
    if (!base64Data || base64Data.length === 0) {
      throw new Error("Invalid image data");
    }

    // Ensure proper base64 padding
    const paddingLength = 4 - (base64Data.length % 4);
    const paddedBase64 =
      paddingLength < 4 ? base64Data + "=".repeat(paddingLength) : base64Data;

    // Validate base64 characters
    if (!/^[A-Za-z0-9+/=]+$/.test(paddedBase64)) {
      throw new Error("Invalid base64 characters");
    }

    return paddedBase64;
  } catch (error) {
    console.error("Error sanitizing base64:", error);
    throw new Error("Invalid image format");
  }
};

const compressBase64Image = async (base64String: string): Promise<string> => {
  return new Promise<string>((resolve) => {
    try {
      // Create temporary image element
      const img = new Image();

      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Calculate new dimensions (maintain aspect ratio)
          let width = img.width;
          let height = img.height;
          const maxDimension = 1200; // Limit maximum dimension

          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image with reduced size
          ctx?.drawImage(img, 0, 0, width, height);

          // Convert to base64 with reduced quality
          const compressedBase64 = canvas
            .toDataURL("image/jpeg", 0.8)
            .replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

          resolve(compressedBase64);
        } catch (error) {
          console.error("Error compressing image:", error);
          resolve(base64String); // Fall back to original on error
        }
      };

      img.onerror = () => {
        console.error("Error loading image for compression");
        resolve(base64String); // Fall back to original on error
      };

      img.src = `data:image/jpeg;base64,${base64String}`;
    } catch (error) {
      console.error("Error in image compression:", error);
      resolve(base64String); // Fall back to original on error
    }
  });
};

export const extractInfoFromImage = async (
  imageBase64: string
): Promise<ExtractedInfo> => {
  try {
    const sanitizedImage = sanitizeBase64Image(imageBase64);
    const compressedImage = await compressBase64Image(sanitizedImage);

    // Use llama3.2-vision for vision tasks
    const visionResponse = await ollamaApi.post("/api/generate", {
      model: "llama3.2-vision",
      prompt:
        "Extract information from this Malaysian identity card image and return it in a structured format. " +
        "The information must not contain any * or _ characters and should be in the following format:\n" +
        "Include the following fields exactly:\n" +
        "- Full Name\n" +
        "- Identity Card Number\n" +
        "- Address\n" +
        "- Nationality\n",
      images: [compressedImage],
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 500,
      },
    });

    if (!visionResponse.data || !visionResponse.data.response) {
      throw new Error("Invalid response from vision model");
    }

    const extractedText = visionResponse.data.response;

    // Try to parse the response
    const parsedInfo = extractJsonFromText(extractedText);

    // Validate and clean the extracted data
    const result: ExtractedInfo = {
      full_name: parsedInfo.fullName?.trim() || "",
      identity_card_number: parsedInfo.identityCardNumber?.trim() || "",
      date_of_birth: extractDOBFromIC(
        parsedInfo.identityCardNumber?.trim() || ""
      ),
      address: parsedInfo.address?.trim() || "",
      nationality: parsedInfo.nationality?.trim() || "",
    };

    // Validate the extracted information
    if (Object.values(result).every((value) => !value)) {
      throw new Error("No information could be extracted from the image");
    }

    return result;
  } catch (error) {
    console.error("Error extracting information from image:", error);
    throw error;
  }
};
