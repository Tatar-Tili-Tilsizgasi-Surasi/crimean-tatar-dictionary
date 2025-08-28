
import { DictionaryEntry, WordMeaning } from '../types';

// The base letters for which data files exist. One file per letter.
const alphabetFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];

// Maps specific alphabet characters (including diacritics) to their base file letter.
const letterToFileMap: { [key: string]: string } = {
    'a': 'a', 'á': 'a',
    'b': 'b',
    'ç': 'c',
    'd': 'd',
    'e': 'e',
    'f': 'f',
    'g': 'g', 'ğ': 'g',
    'h': 'h',
    'i': 'i', 'í': 'i', 'î': 'i',
    'j': 'j',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n', 'ñ': 'n',
    'o': 'o', 'ó': 'o',
    'p': 'p',
    'r': 'r',
    's': 's', 'ş': 's',
    't': 't',
    'u': 'u', 'ú': 'u',
    'v': 'v',
    'w': 'w',
    'y': 'y',
    'z': 'z',
};

// The alphabet for custom sorting, as specified for correct Crimean Tatar alphabetical order.
const customAlphabet = ['a', 'á', 'b', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'i', 'í', 'î', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ó', 'p', 'r', 's', 'ş', 't', 'u', 'ú', 'v', 'w', 'y', 'z'];
// Create a map for quick lookup of character order.
const alphabetOrderMap = new Map<string, number>(customAlphabet.map((char, index) => [char, index]));

// Custom comparison function for sorting words according to the Crimean Tatar alphabet.
const customCompare = (a: string, b: string): number => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const maxLength = Math.max(aLower.length, bLower.length);

    for (let i = 0; i < maxLength; i++) {
        if (i >= aLower.length) return -1; // a is shorter
        if (i >= bLower.length) return 1; // b is shorter

        const charA = aLower[i];
        const charB = bLower[i];

        const orderA = alphabetOrderMap.get(charA);
        const orderB = alphabetOrderMap.get(charB);
        
        // If both are in alphabet and different
        if (orderA !== undefined && orderB !== undefined && orderA !== orderB) {
            return orderA - orderB;
        }
        
        // If one is in alphabet and other is not (e.g. letter vs. punctuation)
        // We want letters to come before punctuation.
        if (orderA !== undefined && orderB === undefined) return -1;
        if (orderA === undefined && orderB !== undefined) return 1;

        // If both are not in alphabet, or are the same character from alphabet
        if (charA !== charB) {
            // Standard localeCompare for punctuation, spaces, etc.
            return charA.localeCompare(charB);
        }
    }
    return 0; // identical
};

// Cache to store parsed dictionary entries to avoid re-parsing files.
const cache = new Map<string, DictionaryEntry[]>();

const parseMeaningChunk = (chunk: string): WordMeaning => {
  const partNumberMatch = chunk.match(/^([IVX]+\.|[A-Z]\.)/);
  const partNumber = partNumberMatch ? partNumberMatch[1] : undefined;
  let remainingChunk = partNumber ? chunk.substring(partNumber.length).trim() : chunk;

  const abbrMatch = remainingChunk.match(/^((?:[a-zA-Z]+\.,?\s*)+)/);
  const abbreviation = abbrMatch ? abbrMatch[1].trim() : undefined;
  let definitionsString = abbreviation ? remainingChunk.substring(abbrMatch[1].length).trim() : remainingChunk;
  
  let definitions: string[];

  // If there are numbered definitions, split by number.
  if (/^\s*\d+\.\s*/.test(definitionsString) || /\s+\d+\.\s*/.test(definitionsString)) {
    definitions = definitionsString
      .split(/\s*\d+\.\s*/)
      .map(d => d.trim().replace(/[;.]\s*$/, ''))
      .filter(Boolean);
  } else {
    // Treat as a single definition if not numbered
    definitions = [definitionsString.trim().replace(/[.]\s*$/, '')].filter(Boolean);
  }
  
  return { partNumber, abbreviation, definitions };
};

const parseDictionaryEntries = (text: string): DictionaryEntry[] => {
  const entries: DictionaryEntry[] = [];
  const lines = text.trim().split('\n');
  const wordAndDefRegex = new RegExp(`^(.*?)\\s+((?:[IVX]+\\.|[A-Z]\\.|[a-z]+\\.).*)`);

  for (const line of lines) {
    if (!line.trim()) continue;

    const match = line.match(wordAndDefRegex);
    if (!match) continue;
    
    const word = match[1];
    let restOfLine = match[2].trim();

    if (restOfLine.startsWith('- ')) {
        const definition = restOfLine.substring(2).trim();
        entries.push({
            word,
            meanings: [{ definitions: [definition] }],
            examples: [],
        });
        continue;
    }

    const [meaningsPart, ...exampleParts] = restOfLine.split('//');
    const examples = exampleParts.flatMap(p => p.split('●')).map(p => p.trim()).filter(Boolean);

    const meanings: WordMeaning[] = [];
    // Changed the capturing group to a non-capturing group (?:...) to prevent inconsistent `split` behavior.
    const meaningChunks = meaningsPart.trim().split(/\s+(?=(?:[IVX]+\.|[A-Z]\.)\s)/).map(s => s.trim()).filter(Boolean);
    
    if (meaningChunks.length > 0) {
        meaningChunks.forEach(chunk => meanings.push(parseMeaningChunk(chunk)));
    } else if (meaningsPart.trim()) {
        meanings.push(parseMeaningChunk(meaningsPart.trim()));
    }
    
    if (word && (meanings.length > 0 || examples.length > 0)) {
        entries.push({ word, meanings, examples });
    }
  }

  return entries;
};

const loadDictionaryFile = async (fileLetter: string): Promise<DictionaryEntry[]> => {
    if (cache.has(fileLetter)) {
        return cache.get(fileLetter)!;
    }
    
    try {
        // Dynamically import the dictionary data file.
        const module = await import(`../data/dictionary/${fileLetter}.ts`);
        const rawDictionaryText = module.default.replace(/Ń/g, 'ţ');
        const entries = parseDictionaryEntries(rawDictionaryText);
        cache.set(fileLetter, entries);
        return entries;
    } catch (error) {
        console.warn(`Could not load dictionary file for letter '${fileLetter}':`, error);
        // Return empty array and cache it to prevent future failed attempts for the same letter in the same session.
        cache.set(fileLetter, []);
        return [];
    }
};

export const searchDictionary = async (term: string): Promise<DictionaryEntry[]> => {
  if (!term.trim()) {
    return [];
  }

  const lowerCaseTerm = term.toLowerCase();
  const allResults: DictionaryEntry[] = [];
  const addedWords = new Set<string>(); // To prevent duplicate entries in results

  // Iterate over all possible dictionary files to perform a comprehensive search.
  for (const fileLetter of alphabetFiles) {
    const entries = await loadDictionaryFile(fileLetter);
    const results = entries.filter(entry => {
      if (addedWords.has(entry.word)) {
        return false;
      }

      if (entry.word.toLowerCase().startsWith(lowerCaseTerm)) {
        return true;
      }

      const isInDefinitions = entry.meanings.some(m => 
        m.definitions.some(d => d.toLowerCase().includes(lowerCaseTerm))
      );
      if (isInDefinitions) {
        return true;
      }

      const isInExamples = entry.examples.some(p => p.toLowerCase().includes(lowerCaseTerm));
      if (isInExamples) {
        return true;
      }
      
      return false;
    });
    
    for (const entry of results) {
        if (!addedWords.has(entry.word)) {
            allResults.push(entry);
            addedWords.add(entry.word);
        }
    }
  }
  
  // Sort results: matches in 'word' field first, then by alphabetical order using the custom sort function.
  return allResults.sort((a, b) => {
    const aIsWordMatch = a.word.toLowerCase().startsWith(lowerCaseTerm);
    const bIsWordMatch = b.word.toLowerCase().startsWith(lowerCaseTerm);

    if (aIsWordMatch && !bIsWordMatch) {
      return -1; // a comes first
    }
    if (!aIsWordMatch && bIsWordMatch) {
      return 1; // b comes first
    }

    // If both are word matches or neither are, sort alphabetically by word.
    return customCompare(a.word, b.word);
  });
};

export const getEntriesByLetter = async (letter: string): Promise<DictionaryEntry[]> => {
    if (!letter) {
        return [];
    }
    
    const fileLetter = letterToFileMap[letter.toLowerCase()];
    if (!fileLetter) {
        return [];
    }

    const entries = await loadDictionaryFile(fileLetter);
    const lowerCaseLetter = letter.toLowerCase();
    
    const filteredEntries = entries.filter(entry => entry.word.toLowerCase().startsWith(lowerCaseLetter));
    return filteredEntries.sort((a, b) => customCompare(a.word, b.word));
};
