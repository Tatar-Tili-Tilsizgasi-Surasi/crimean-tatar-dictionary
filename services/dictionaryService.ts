import { DictionaryEntry, WordMeaning } from '../types';

// The base letters for which data files exist. One file per letter.
const alphabetFiles = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z', 'old'];

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
    't': 't', 'ţ': 'old',
    'u': 'u', 'ú': 'u',
    'v': 'v',
    'w': 'w',
    'y': 'y',
    'z': 'z',
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

const parseDictionaryEntries = (text: string, isOld: boolean = false): DictionaryEntry[] => {
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
            isOld,
        });
        continue;
    }

    const [meaningsPart, ...exampleParts] = restOfLine.split('//');
    const examples = exampleParts.flatMap(p => p.split('●')).map(p => p.trim()).filter(Boolean);

    const meanings: WordMeaning[] = [];
    const meaningChunks = meaningsPart.trim().split(/\s+(?=([IVX]+\.|[A-Z]\.)\s)/).map(s => s.trim()).filter(Boolean);
    
    if (meaningChunks.length > 0) {
        meaningChunks.forEach(chunk => meanings.push(parseMeaningChunk(chunk)));
    } else if (meaningsPart.trim()) {
        meanings.push(parseMeaningChunk(meaningsPart.trim()));
    }
    
    if (word && (meanings.length > 0 || examples.length > 0)) {
        entries.push({ word, meanings, examples, isOld });
    }
  }

  return entries;
};

const loadDictionaryFile = async (fileLetter: string): Promise<DictionaryEntry[]> => {
    if (cache.has(fileLetter)) {
        return cache.get(fileLetter)!;
    }
    try {
        const module = await import(`../data/dictionary/${fileLetter}.ts`);
        const rawText = module.default;
        const isOldFile = fileLetter === 'old';
        const entries = parseDictionaryEntries(rawText, isOldFile);
        cache.set(fileLetter, entries);
        return entries;
    } catch (error) {
        console.error(`Error loading dictionary file for letter "${fileLetter}":`, error);
        return [];
    }
};

const getAllEntries = async (): Promise<DictionaryEntry[]> => {
  const allEntries: DictionaryEntry[] = [];
  for (const letter of alphabetFiles) {
    const entries = await loadDictionaryFile(letter);
    allEntries.push(...entries);
  }
  return Array.from(new Map(allEntries.map(entry => [entry.word, entry])).values());
};

export const searchDictionary = async (term: string): Promise<DictionaryEntry[]> => {
  if (!term.trim()) {
    return [];
  }
  const allEntries = await getAllEntries();
  const lowerCaseTerm = term.toLowerCase();

  return allEntries.filter(entry =>
    entry.word.toLowerCase().includes(lowerCaseTerm) ||
    entry.meanings.some(meaning =>
      meaning.definitions.some(def => def.toLowerCase().includes(lowerCaseTerm))
    ) ||
    entry.examples.some(example => example.toLowerCase().includes(lowerCaseTerm))
  ).sort((a, b) => {
      if (a.word.toLowerCase() === lowerCaseTerm) return -1;
      if (b.word.toLowerCase() === lowerCaseTerm) return 1;
      if (a.word.toLowerCase().startsWith(lowerCaseTerm) && !b.word.toLowerCase().startsWith(lowerCaseTerm)) return -1;
      if (!a.word.toLowerCase().startsWith(lowerCaseTerm) && b.word.toLowerCase().startsWith(lowerCaseTerm)) return 1;
      return a.word.localeCompare(b.word);
  });
};

export const getEntriesByLetter = async (letter: string): Promise<DictionaryEntry[]> => {
    const fileLetter = letterToFileMap[letter.toLowerCase()];
    if (!fileLetter) {
        return [];
    }

    // Load entries from the letter's primary file.
    const primaryEntries = await loadDictionaryFile(fileLetter);

    // If the primary file is not 'old', also load 'old' entries to find archaic words starting with the same letter.
    const oldEntries = fileLetter !== 'old' ? await loadDictionaryFile('old') : [];

    const allEntries = [...primaryEntries, ...oldEntries];
    
    // Remove duplicates. new Map keeps the last entry for a key.
    // So if a word is in both a primary file and old.ts, the one from old.ts will be kept.
    const uniqueEntriesMap = new Map(allEntries.map(entry => [entry.word, entry]));
    
    // Filter all loaded entries by the starting letter.
    const finalEntries: DictionaryEntry[] = [];
    for (const entry of uniqueEntriesMap.values()) {
        if (entry.word.toLowerCase().startsWith(letter.toLowerCase())) {
            finalEntries.push(entry);
        }
    }
    
    // Sort alphabetically by word.
    finalEntries.sort((a, b) => a.word.localeCompare(b.word));

    return finalEntries;
};
