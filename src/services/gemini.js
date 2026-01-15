import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with your key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key on load
if (!API_KEY) {
    console.error(
        '⚠️ Missing Gemini API key.\n' +
        'Please add VITE_GEMINI_API_KEY to your .env file.'
    );
}

const genAI = new GoogleGenerativeAI(API_KEY || 'missing-key');

// Rate limiting: max 10 requests per minute
const RATE_LIMIT = {
    maxRequests: 10,
    windowMs: 60000, // 1 minute
    requests: [],
};

function checkRateLimit() {
    const now = Date.now();
    // Remove requests older than the window
    RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
        time => now - time < RATE_LIMIT.windowMs
    );

    if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
        const oldestRequest = RATE_LIMIT.requests[0];
        const waitTime = Math.ceil((RATE_LIMIT.windowMs - (now - oldestRequest)) / 1000);
        throw new Error(`Rate limit reached. Please wait ${waitTime} seconds before trying again.`);
    }

    RATE_LIMIT.requests.push(now);
}

// User-friendly error messages
function getErrorMessage(error) {
    const message = error.message || '';

    if (message.includes('429') || message.includes('quota')) {
        return 'AI service is temporarily busy. Please try again in a minute.';
    }
    if (message.includes('400') || message.includes('invalid')) {
        return 'Unable to analyze this image. Please try a clearer photo.';
    }
    if (message.includes('401') || message.includes('403')) {
        return 'API authentication failed. Please check your configuration.';
    }
    if (message.includes('500') || message.includes('503')) {
        return 'AI service is temporarily unavailable. Please try again later.';
    }
    if (message.includes('Rate limit')) {
        return message; // Already user-friendly
    }

    return 'Failed to analyze image. Please try again.';
}

export async function analyzeFoodImage(imageFile) {
    // Check API key first
    if (!API_KEY) {
        throw new Error('Gemini API key not configured. Please contact support.');
    }

    // Check rate limit
    try {
        checkRateLimit();
    } catch (rateLimitError) {
        throw rateLimitError;
    }

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
        throw new Error(getErrorMessage(error));
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
