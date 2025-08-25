
export interface WordMeaning {
  partNumber?: string;
  abbreviation?: string;
  definitions: string[];
}

export interface DictionaryEntry {
  word: string;
  meanings: WordMeaning[];
  examples: string[];
}