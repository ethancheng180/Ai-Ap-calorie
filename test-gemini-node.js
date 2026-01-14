
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Replicating the logic from src/services/gemini.js
const API_KEY = "AIzaSyBuCLeFzR5zwwuH7Ctde4TAjtj2IVPpHhY";
const genAI = new GoogleGenerativeAI(API_KEY);


async function testGemini() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Use the uploaded image
        const imagePath = "/Users/ethancheng/.gemini/antigravity/brain/890ea74a-8d97-4656-a490-b790abff92c7/test_food_pasta_1768370429087.png";

        console.log(`Reading image from ${imagePath}...`);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Data = imageBuffer.toString('base64');

        const prompt = `
          Analyze this image of food. Identify the food item and estimate its nutritional content.
          Return ONLY a valid JSON object.
        `;

        console.log("Sending request to Gemini API (gemini-2.0-flash)...");
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/png"
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("Success! Response:");
        console.log(text);

    } catch (error) {
        console.error("Error analyzing image:");
        console.error(error);

        if (error.response) {
            console.error("Error details:", JSON.stringify(error.response, null, 2));
        }
    }
}

testGemini();
