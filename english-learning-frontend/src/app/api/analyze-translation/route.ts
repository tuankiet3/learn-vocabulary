import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
  try {
    // Debug: Log API key (first few characters only)
    const apiKey = process.env.GOOGLE_API_KEY;
    console.log("API Key (first 10 chars):", apiKey ? `${apiKey.substring(0, 10)}...` : "Not set");

    const { original, translation } = await request.json();

    if (!original || !translation) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get the generative model with safety settings
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-pro-exp-03-25", // <--- ĐÃ SỬA
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      })

    const prompt = `Analyze this English translation of a Vietnamese sentence. Provide feedback in Vietnamese about:
1. Grammar errors
2. Missing punctuation
3. Suggested corrections
4. Overall accuracy

Vietnamese original: "${original}"
English translation: "${translation}"

Format the response as a clear, constructive feedback message in Vietnamese.`;

    console.log("Sending request to Gemini API with prompt:", prompt);

    // Use generateContent with simpler structure
    const result = await model.generateContent(prompt);
    console.log("Received response from Gemini API");

    const response = await result.response;
    const feedback = response.text() || "Không thể phân tích bản dịch.";

    console.log("Generated feedback:", feedback);

    return NextResponse.json({ message: feedback });
  } catch (error) {
    console.error("Translation analysis error:", error);
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { error: "Failed to analyze translation. Please try again." },
      { status: 500 }
    );
  }
} 