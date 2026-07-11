import { GoogleGenAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    // 1. Get the text that the user typed from the incoming request
    const { text } = await request.json();

    // 2. Initialize the Gemini client using the environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 3. Call the Gemini 2.5 Flash model (great for fast text tasks)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: text,
    });

    // 4. Send the generated text back to our frontend webpage
    return new Response(JSON.stringify({ output: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}