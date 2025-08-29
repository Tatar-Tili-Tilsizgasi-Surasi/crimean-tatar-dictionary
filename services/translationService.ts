import { GoogleGenAI } from "@google/genai";
import { systemInstruction } from '../promptData';
import { searchDictionary } from "./dictionaryService";
import { DictionaryEntry } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const formatPrompt = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    let prompt = '';

    // Search for relevant dictionary entries to provide context
    try {
        const uniqueWords = [...new Set(text.toLowerCase().replace(/[.,!?]/g, '').split(/\s+/).filter(w => w.length >= 3))];
        const relevantEntries: DictionaryEntry[] = [];
        const seenWords = new Set<string>();

        // Limit how many words we search to avoid performance issues on long texts
        const wordsToSearch = uniqueWords.slice(0, 15);

        for (const word of wordsToSearch) {
            const results = await searchDictionary(word);
            // Take top 1-2 results for each word to keep context focused
            results.slice(0, 2).forEach(entry => {
                if (!seenWords.has(entry.word)) {
                    relevantEntries.push(entry);
                    seenWords.add(entry.word);
                }
            });
        }

        if (relevantEntries.length > 0) {
            prompt += "For context, here are some relevant dictionary entries from 'Sózlík'. Use these specific terms and definitions where appropriate to ensure accuracy and consistency with the dictionary's vocabulary:\n";
            
            // Limit the total number of entries to avoid a huge prompt
            relevantEntries.slice(0, 10).forEach(entry => {
                const definitions = entry.meanings.map(m => m.definitions.join('; ')).join(' | ');
                prompt += `- ${entry.word}: ${definitions}\n`;
            });
        }
    } catch (e) {
        console.error("Error fetching dictionary context for translation prompt:", e);
        // If dictionary search fails, proceed without the extra context.
    }

    const sourceLangName = sourceLang === 'ct' ? "Kîrîm tatarşa" : "Romanian";
    
    if (prompt) {
        prompt += '\n---\n\n';
    }
    
    prompt += `Translate the following text.\nInput: ${sourceLangName}: ${text}\nOutput:`;

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
  const prompt = await formatPrompt(text, sourceLang, targetLang);

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