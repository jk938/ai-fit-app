import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME } from "../constants";
import { stripBase64Prefix, urlToBase64 } from "./utils";

// Manual declaration to satisfy TypeScript since @types/node is not available
declare const process: {
  env: {
    API_KEY: string;
  };
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateClothingImage = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `Product photography of ${prompt}, clothing item only, white background, high quality, studio lighting.`;
    
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: fullPrompt,
      config: {
        // Nano banana / flash-image doesn't support aspectRatio config in the same way as Imagen, 
        // but we will try to guide it via prompt or default.
        // Note: flash-image generates mixed content, we need to find the image part.
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated in response");
  } catch (error) {
    console.error("Gemini Clothing Generation Error:", error);
    throw error;
  }
};

export const generateTryOn = async (personUrl: string, clothingUrl: string): Promise<string> => {
  try {
    const personBase64 = await urlToBase64(personUrl);
    const clothingBase64 = await urlToBase64(clothingUrl);

    // Construct the prompt for 'Nano Banana' (gemini-2.5-flash-image)
    // It supports text + image inputs.
    const prompt = "Generate a high-quality, photorealistic full-body image of the person in the first image wearing the clothing shown in the second image. Maintain the person's pose, facial features, and body shape. Ensure the clothing fits naturally.";

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: stripBase64Prefix(personBase64)
            }
          },
          {
            inlineData: {
              mimeType: 'image/png',
              data: stripBase64Prefix(clothingBase64)
            }
          }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image generated in response");

  } catch (error) {
    console.error("Gemini Try-On Generation Error:", error);
    throw error;
  }
};