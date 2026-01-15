
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const modelResponse = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Note: The SDK doesn't have a direct 'listModels' helper easily accessible on the client instance 
        // in some versions, but let's try to just hit the API endpoint or use a known valid one.
        // Actually, checking the docs, we should use the model manager if valid, or just test a few.

        // Better approach: Test specific model names to see which one doesn't 404.
        const modelsToTest = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-001",
            "gemini-1.5-flash-002",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro-vision"
        ];

        console.log("Testing model availability...");

        for (const modelName of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`✅ ${modelName} is WORKING`);
                break; // Found one!
            } catch (error) {
                if (error.status === 404 || error.message.includes("404") || error.message.includes("not found")) {
                    console.log(`❌ ${modelName} - Not Found (404)`);
                } else if (error.status === 429 || error.message.includes("429")) {
                    console.log(`⚠️ ${modelName} - Quota Exceeded (429) - Exists but busy`);
                } else {
                    console.log(`❌ ${modelName} - Error: ${error.message}`);
                }
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
