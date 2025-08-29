import { GoogleGenAI } from "@google/genai";
import { systemInstruction, translationExamples } from '../promptData';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatPrompt = (text: string, sourceLang: string, targetLang: string): string => {
    let prompt = `Here are some examples:\n`;
    
    translationExamples.forEach(example => {
        prompt += `Input: ${example.input}\nOutput: ${example.output}\n`;
    });

    const sourceLangName = sourceLang === 'ct' ? "Kîrîm tatarşa" : "Romanian";
    
    prompt += `\nNow, translate the following text.\nInput: ${sourceLangName}: ${text}\nOutput:`;

    return prompt;
};

export const translateText = async (
  text: string,
  sourceLang: 'ct' | 'ro',
  targetLang: 'ct' | 'ro'
): Promise<string> => {
  if (!text.trim()) {
    return '';
  }

  const model = 'gemini-2.5-flash';
  const prompt = formatPrompt(text, sourceLang, targetLang);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3,
      }
    });

    let translated = response.text.trim();
    
    // The model might prepend the language name, so we strip it.
    const targetLangNameRo = "Romanian:";
    const targetLangNameCt = "Kîrîm tatarşa:";

    if (translated.toLowerCase().startsWith(targetLangNameRo.toLowerCase())) {
        translated = translated.substring(targetLangNameRo.length).trim();
    }
    if (translated.toLowerCase().startsWith(targetLangNameCt.toLowerCase())) {
        translated = translated.substring(targetLangNameCt.length).trim();
    }

    return translated;
  } catch (error) {
    console.error("Error during translation:", error);
    return "An error occurred while translating. Please try again.";
  }
};
