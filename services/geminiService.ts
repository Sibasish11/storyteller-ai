import { GoogleGenAI, Type } from "@google/genai";
import type { StorySegmentPayload } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const storyGenerationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      paragraph: {
        type: Type.STRING,
        description: 'A single paragraph of the generated story.',
      },
      image_prompt: {
        type: Type.STRING,
        description: 'A concise, visually descriptive prompt for an AI image generator, capturing the essence of the paragraph. This should be cinematic and artistic.',
      },
    },
    required: ['paragraph', 'image_prompt'],
  },
};

export const generateStoryAndImagePrompts = async (prompt: string): Promise<StorySegmentPayload[]> => {
  const systemInstruction = `You are a creative and eloquent storyteller. Your task is to write a short, imaginative story based on the user's prompt.
- The story must be exactly 3 paragraphs long.
- For each paragraph, you must also create a concise, visually descriptive prompt suitable for an AI image generator.
- This image prompt should capture the main action, mood, or subject of the paragraph in a single, powerful sentence.
- The output must be a JSON array, strictly following the provided schema.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: storyGenerationSchema,
      temperature: 0.8,
    },
  });
  
  const jsonText = response.text.trim();
  try {
    const parsed = JSON.parse(jsonText);
    return parsed as StorySegmentPayload[];
  } catch (e) {
    console.error("Failed to parse JSON from Gemini:", jsonText);
    throw new Error("The AI returned an invalid story structure. Please try again.");
  }
};
