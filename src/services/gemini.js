import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key
// For security in production, this should be called from a backend.
// But for this local demo, we will call it directly.
const API_KEY = "AIzaSyBuCLeFzR5zwwuH7Ctde4TAjtj2IVPpHhY";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeFoodImage(imageFile) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Convert file to base64
        const base64Data = await fileToGenerativePart(imageFile);

        const prompt = `
      Analyze this image of food. Identify the food item and estimate its nutritional content.
      Return ONLY a valid JSON object with the following structure:
      {
        "foodName": "Name of the food",
        "calories": 0,
        "macros": {
          "protein": 0, // in grams
          "carbs": 0, // in grams
          "fat": 0 // in grams
        },
        "description": "A brief, 1-sentence description of the meal.",
        "micronutrients": [
           { "name": "Vitamin A", "value": "10%" },
           { "name": "Calcium", "value": "5%" }
        ]
      }
      Do not include markdown code blocks (like \`\`\`json). Just the raw JSON string.
    `;

        const result = await model.generateContent([prompt, base64Data]);
        const response = await result.response;
        const text = response.text();

        // Clean up if the model returned markdown
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error analyzing image:", error);
        throw error;
    }
}

async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve({
                inlineData: {
                    data: base64String,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
