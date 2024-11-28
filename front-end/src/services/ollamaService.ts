import axios from "axios";

interface ExtractedInfo {
  fullName: string;
  identityCardNumber: string;
  dateOfBirth: string;
  address: string;
  nationality: string;
}

// Configure axios defaults
const ollamaApi = axios.create({
  baseURL: "http://localhost:11434",
  headers: {
    "Content-Type": "application/json",
  },
});

const extractJsonFromText = (text: string): Record<string, string> => {
  try {
    // Try to find a JSON object in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON object found in response");
  } catch (error) {
    console.error("Failed to extract JSON from text:", error);
    return {};
  }
};

export const extractInfoFromImage = async (
  imageBase64: string
): Promise<ExtractedInfo> => {
  try {
    // Use llama3-vision for vision tasks
    const visionResponse = await ollamaApi.post("/api/generate", {
      model: "llama3.2-vision",
      prompt:
        "Extract information from this Malaysian identity card image. Respond with ONLY these details in order:\n" +
        "Name:\nIC Number:\nDate of Birth:\nAddress:\nNationality:",
      images: [imageBase64],
      stream: false,
    });

    if (!visionResponse.data || !visionResponse.data.response) {
      throw new Error("Invalid response from vision model");
    }

    const extractedText = visionResponse.data.response;
    console.log("Extracted text:", extractedText); // Debug log

    // Use llama3 to parse the extracted text into structured data
    const parseResponse = await ollamaApi.post("/api/generate", {
      model: "llama3",
      prompt: `Your task is to convert this Malaysian IC information into a JSON object. ONLY RESPOND WITH THE JSON OBJECT, NO OTHER TEXT.

Input text:
${extractedText}

Required JSON format:
{
  "fullName": "name value",
  "identityCardNumber": "IC number value",
  "dateOfBirth": "date of birth value",
  "address": "address value",
  "nationality": "nationality value"
}`,
      stream: false,
    });

    if (!parseResponse.data || !parseResponse.data.response) {
      throw new Error("Invalid response from text model");
    }

    console.log("Parse response:", parseResponse.data.response); // Debug log

    // Extract and parse the JSON from the response
    const parsedInfo = extractJsonFromText(parseResponse.data.response);

    // Ensure all required fields exist, use empty string if missing
    const result: ExtractedInfo = {
      fullName: parsedInfo.fullName || "",
      identityCardNumber: parsedInfo.identityCardNumber || "",
      dateOfBirth: parsedInfo.dateOfBirth || "",
      address: parsedInfo.address || "",
      nationality: parsedInfo.nationality || "",
    };

    // Only throw error if ALL fields are empty
    if (Object.values(result).every(value => !value)) {
      throw new Error("No information could be extracted from the image");
    }

    return result;
  } catch (error) {
    console.error("Error processing image:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        `Failed to process identity card image: ${error.message}`
      );
    }
    throw error;
  }
};
