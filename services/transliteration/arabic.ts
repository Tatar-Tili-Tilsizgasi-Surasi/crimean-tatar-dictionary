// Helper to check if a character is considered a Latin letter for word boundary checks
function isLatinLetter(char: string | null | undefined): boolean {
    if (char === null || char === undefined) return false;
     // This regex covers all listed Latin input characters used as letters
    return /[a-záéíóúñğçşîûüö]/i.test(char);
}

 // Helper to check if a character is a consonant that can be geminated (used for the XX rule)
 function isPotentialGeminatingConsonant(char: string): boolean {
     const geminatableConsonants = new Set([
         'b', 'p', 't', 'ğ', 'ç', 'd', 'r', 'z', 'j', 's', 'ş',
         'f', 'ñ', 'l', 'm', 'n', 'w', 'v', 'h', 'y', 'g', 'k'
     ]);
     return geminatableConsonants.has(char);
 }

 // Hard/Soft vowels for GK rule determination
 // á, ó, ú are now considered soft for GK rule
const hardVowelRuleSet = new Set(['a', 'î', 'o', 'û']); // Removed ó, ú
const softVowelRuleSet = new Set(['á', 'e', 'é', 'i', 'í', 'ö', 'ü', 'ó', 'ú']); // Added ó, ú


// Helper for G/K rule lookup based on surrounding vowels
function getArabicGK(latinChar: string, latinString: string, currentIndex: number, latinVowelSet: Set<string>, hardVowelSet: Set<string>, softVowelSet: Set<string>): string {
     const isHardVowel = (vowel: string) => hardVowelSet.has(vowel);
     const isSoftVowel = (vowel: string) => softVowelSet.has(vowel);
     const char = latinString[currentIndex]; // already lowercased

     // Check adjacent vowels first, prioritizing preceding
     const prevInputChar = currentIndex > 0 ? latinString[currentIndex - 1] : null;
     const nextInputChar = currentIndex < latinString.length - 1 ? latinString[currentIndex + 1] : null;

     // Check immediately preceding vowel
     if (prevInputChar !== null && latinVowelSet.has(prevInputChar)) {
         if (isSoftVowel(prevInputChar)) return (char === 'g' ? 'گ' : 'ك'); // Preceding Soft -> Soft GK
         if (isHardVowel(prevInputChar)) return (char === 'g' ? 'غ' : 'ق'); // Preceding Hard -> Hard GK
     }

    // Check immediately following vowel
     if (nextInputChar !== null && latinVowelSet.has(nextInputChar)) {
         if (isSoftVowel(nextInputChar)) return (char === 'g' ? 'گ' : 'ك'); // Following Soft -> Soft GK
         if (isHardVowel(nextInputChar)) return (char === 'g' ? 'غ' : 'ق'); // Following Hard -> Hard GK
     }

    // Search backwards for the last vowel
    let lastVowelBefore = null;
    for (let k = currentIndex - 1; k >= 0; k--) {
        if (latinVowelSet.has(latinString[k])) {
            lastVowelBefore = latinString[k];
            break;
        }
    }
    if (lastVowelBefore !== null) {
         if (isSoftVowel(lastVowelBefore)) return (char === 'g' ? 'گ' : 'ك'); // Last Before Soft -> Soft GK
         if (isHardVowel(lastVowelBefore)) return (char === 'g' ? 'غ' : 'ق'); // Last Before Hard -> Hard GK
    }

    // Search forwards for the first vowel
    let firstVowelAfter = null;
    for (let k = currentIndex + 1; k < latinString.length; k++) {
         if (latinVowelSet.has(latinString[k])) {
            firstVowelAfter = latinString[k];
            break;
        }
    }
     if (firstVowelAfter !== null) {
         if (isSoftVowel(firstVowelAfter)) return (char === 'g' ? 'گ' : 'ك'); // First After Soft -> Soft GK
         if (isHardVowel(firstVowelAfter)) return (char === 'g' ? 'غ' : 'ق'); // First After Hard -> Hard GK
     }

    // Default soft (based on common Uyghur practice when no vowel context)
    return latinChar === 'g' ? 'گ' : 'ك';
}

// Define consonant mappings
const consonantsBase: { [key: string]: string } = {
    'b': 'ب', 'p': 'پ', 't': 'ت', 'ğ': 'ج', 'ç': 'چ', 'd': 'د',
    'r': 'ر', 'z': 'ز', 'j': 'ژ', 's': 'س', 'ş': 'ش',
    'f': 'ف', 'ñ': 'ڭ', 'l': 'ل', 'm': 'م', 'n': 'ن',
    'h': 'ه',
    'w': 'و', // Waw can also be a vowel extender
    'y': 'ی', // Yeh can also be a vowel extender
    'v': 'و', // v maps to و
};

// Consonants that Sukun or final marks can attach to or consonants that can receive Sukun.
// Include و and ی as consonants because they appear in consonantsBase.
const allArabicConsonants = new Set([
    ...Object.values(consonantsBase),
    'گ', 'ك', 'غ', 'ق'
]);


const latinVowels = new Set(['a', 'á', 'e', 'é', 'i', 'í', 'î', 'u', 'ú', 'û', 'o', 'ó', 'ö', 'ü']);

// Pre-defined vowel sequences
// Note: 'iy' will have a random alternative now, handled in transliterateWord
const latinVowelSequences = new Set([
     'aa', 'ee',     // -> َآ
     'aá', 'áa', 'áá', // -> َا
     'ii',           // -> ِىٓ
     'oo', 'uw', 'úw', // -> ُو
     // 'iy' handled separately for randomization
]);

// Mappings for standard short vowel diacritics
const vowelsShortDiacritic: { [key: string]: string } = {
    'a': 'َ', 'á': 'َ', 'e': 'َ', 'é': 'َ', // Fatha
    'i': 'ِ', 'í': 'ِ', 'î': 'ِ', // Kasra
    'u': 'ُ', 'ú': 'ُ', 'û': 'ُ', 'o': 'ُ', 'ó': 'ُ', 'ö': 'ُ', 'ü': 'ُ' // Damma
};

// Mappings for alternative/decoration marks
 const alternativeMarks: { [key: string]: string } = {
     'alt_i': 'ٖ', // Alternative for middle/end i/í/î
     'alt_iy': 'ٖی', // Alternative for iy sequence
     'tanwin_a': 'ً', // Tanwin for a/e/é/á vowels ending in n/ñ
     'tanwin_u': 'ٌ', // Tanwin for u/o/ö/ü/ú/ó vowels ending in n/ñ
     'tanwin_i': 'ٍ'  // Tanwin for i/í/î vowels ending in n/ñ
};

 // Map Latin vowel chars to types for the Tanwin rules (Rule 2 internal and Final Tanwin)
  const latinVowelToTypeForTanwin: { [key: string]: string } = {
    'a': 'a_like', 'á': 'a_like', 'e': 'a_like', 'é': 'a_like', // a, á, e, é -> ً
    'u': 'u_like', 'ú': 'u_like', 'û': 'u_like', 'o': 'u_like', 'ó': 'u_like', 'ö': 'u_like', 'ü': 'u_like', // u, ú, û, o, ó, ö, ü -> ٌ (Grouped loosely by sound)
    'i': 'i_like', 'í': 'i_like', 'î': 'i_like', // i, í, î -> ٍ
 };
 // Map these types to Tanwin alternatives
  const tanwinMap: { [key: string]: string } = {
      'a_like': alternativeMarks['tanwin_a'], // ً
      'u_like': alternativeMarks['tanwin_u'], // ٌ
      'i_like': alternativeMarks['tanwin_i'] // ٍ
  };


  // Alternative marks for the 'a'/'á' decoration rule (Applied during standard vowel handling, NOT initial)
  const aDecorationAlternativesForA = ['َ', 'َا', 'َو', 'َی', 'ٰ', 'ٰا', 'ٰو', 'ٰی']; // 8 options for 'a'
  const aDecorationAlternativesForÁ = ['َ', 'َا', 'ٰ', 'ٰا']; // 4 options for 'á'


// Punctuation symbols
const punctuationSymbolsSet = new Set(['!', '.', ',', '?']);

// Symbol map *excluding* the single quote, which is now ignored
const symbolMap: { [key: string]: string } = {
    '!': '؞', '.': '۔', ',': '،', '?': '؟', ';': '؛', ':': ':',
    '"': 'ۧ', '-': '؍', '(': '؍', ')': '؍', '%': '٪',
    // Removed "'": 'ء'
     ' ': ' ' // Include space for splitting
};

const digitMap: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
};

// Separator characters (based on symbolMap, digitMap, and anything not a Latin letter)
// Exclude the single quote as it is ignored
const separatorChars = new Set([...Object.keys(symbolMap), ...Object.keys(digitMap)]);


// Characters/Sequences/Marks that prevent Sukūn/Alternative on the *preceding* consonant or block diacritic attachment
// Includes standard diacritics, alternative 'i', Tanwins (both types), Shadda, Madda, and vowel extenders/sequences + intermediate Sukun itself
// Updated to include new alternatives for 'a'/'á' and 'iy'.
 const isPreventingMarkOrExtender = (c: string | undefined): boolean => !!c && (['ا', 'و', 'ی', 'ّ', 'ٓ', 'َآ', 'ِىٓ', 'ُو', 'َا', 'ِی', 'ٰ', 'ٖ', 'ً', 'ٌ', 'ٍ', 'َو', 'َی', 'ٰا', 'ٰو', 'ٰی', 'ٖی', 'َ', 'ِ', 'ُ', 'ْ'].includes(c) || (c && /[\u064B-\u065F\u0670-\u067F\u0610-\u061A]/.test(c)));


// Helper to find the last attachable point for diacritics/marks *within a segment*
// Returns index or -1 (not found) or -2 (blocked)
// Attachable to: base consonants, initial ا, Shadda ّ
// Blocking: any existing mark/diacritic (except ّ), or sequence characters (ا, و, ی etc. unless they are the consonant base)
function findLastDiacriticAttachPointIndex(arr: string[]): number {
     for(let k = arr.length - 1; k >= 0; k--) {
         const c = arr[k];
         // Is it attachable? (Consonant, initial ا, or Shadda)
         const isAttachable = allArabicConsonants.has(c) || c === 'ا' || c === 'ّ';
         if (isAttachable) {
             return k;
         }
         // Is it blocking? (Any other mark, vowel extender, or sequence part)
          const isBlocking = isPreventingMarkOrExtender(c);
          if(isBlocking && c !== 'ّ') { // Shadda is the only 'preventing' mark we *can't* attach *after* a blocking mark
             return -2; // Indicate blocked search
          }
     }
     return -1; // Not found
}

// Helper to check if a character blocks insertion of a diacritic/mark *at* its position *within a segment*
// This is the same as checking if the character itself is a preventing mark/extender, excluding Shadda
function isBlockingInsertion(char: string): boolean {
     return isPreventingMarkOrExtender(char) && char !== 'ّ';
}


// Helper to split Latin input into words and separators
function splitIntoWordsAndSeparators(latin: string): string[] {
    const segments: string[] = [];
    let currentWord = '';
    for (let i = 0; i < latin.length; i++) {
        const char = latin[i]; // Keep original case for separators like ? ! etc.
        const lowerChar = char.toLowerCase();

        // Check if the character should be ignored (currently only single quote)
        if (char === "'") {
            continue; // Skip this character entirely
        }


        const isSeparator = separatorChars.has(char) || separatorChars.has(lowerChar) || !isLatinLetter(lowerChar); // Check both cases for separators

        if (isSeparator) {
            // If we were building a word, add it
            if (currentWord !== '') {
                segments.push(currentWord);
                currentWord = '';
            }
            // Add the separator itself
            segments.push(char); // Add the original character

        } else {
            // It's a letter, add to current word (lowercase)
            currentWord += lowerChar;
        }
    }
    // Add any remaining word at the end
    if (currentWord !== '') {
        segments.push(currentWord);
    }
    return segments;
}


// Helper to transliterate a single Latin word into Arabic characters, including intermediate Sukuns and internal alternatives.
// Final mark (Sukun or END-OF-WORD Tanwin alternative) is *not* applied here.
// Returns { arabicChars: Array, lastSimpleVowelLatinChar: String }
function transliterateWord(latinWord: string): { arabicChars: string[], lastSimpleVowelLatinChar: string | null } {
    let arabicWordChars: string[] = [];
    let lastSimpleVowelLatinChar: string | null = null; // Track the Latin vowel character for the last simple vowel attached to a base

    let i = 0;

    while (i < latinWord.length) {
        const char = latinWord[i]; // Already lowercased by split function
        const nextChar = latinWord[i + 1];
        const nextTwoChars = latinWord.substring(i, i + 2);
        const prevLatin = i > 0 ? latinWord[i - 1] : null;

         // --- Rule Priority within a word ---
         // Check if it's the very first character of the word and it's a vowel
         const isInitialVowel = (i === 0 && latinVowels.has(char));
         if (isInitialVowel) {
             const initialBase = Math.random() < 0.5 ? 'ا' : 'ء'; // Randomly choose initial base
             let markToAttach = vowelsShortDiacritic[char]; // Use standard mapping for initial vowels

             // Ensure standard marks for a/á and i/í/î at the beginning
             if (char === 'a' || char === 'á') {
                  markToAttach = 'َ'; // Always standard Fatha at the start for a/á
              } else if (char === 'i' || char === 'í' || char === 'î') {
                   markToAttach = 'ِ'; // Always standard Kasra at the start for i/í/î
              }

             arabicWordChars.push(initialBase); // Add the base (ا or ء)
             if (markToAttach) {
                  arabicWordChars.push(markToAttach); // Add the standard diacritic mark
             }

             lastSimpleVowelLatinChar = char; // Track the Latin char

             i++; // Processed the single initial vowel Latin char
             continue; // Move to next Latin char
         }


        // 1. Handle Specific Multi-Character Sequences (Gemination, Vowel Sequences, iy)
        // Gemination check (already covers 2 chars)
         const isPotentialGeminatingConsonantAtI = isPotentialGeminatingConsonant(char);
         if (isPotentialGeminatingConsonantAtI && char === nextChar && i + 1 < latinWord.length) {
              let arabicConsonantForGemination;
              if (char === 'g' || char === 'k') { arabicConsonantForGemination = getArabicGK(char, latinWord, i, latinVowels, hardVowelRuleSet, softVowelRuleSet); }
              else { arabicConsonantForGemination = consonantsBase[char]; }
              if (arabicConsonantForGemination) {
                    arabicWordChars.push(arabicConsonantForGemination); arabicWordChars.push('ّ');
                    i += 2; lastSimpleVowelLatinChar = null; continue;
               }
         }

         // Vowel Sequences check (aa, ee, aá, áa, áá, ii, oo, uw,úw)
         if (i + 1 < latinWord.length && latinVowelSequences.has(nextTwoChars)) {
              let sequenceArabic: string | null = null;
              if (nextTwoChars === 'aa' || nextTwoChars === 'ee') sequenceArabic = 'َآ';
              else if (nextTwoChars === 'aá' || nextTwoChars === 'áa' || nextTwoChars === 'áá') sequenceArabic = 'َا';
              else if (nextTwoChars === 'ii') sequenceArabic = 'ِىٓ';
              else if (nextTwoChars === 'oo' || nextTwoChars === 'uw' || nextTwoChars === 'úw') sequenceArabic = 'ُو';

              if (sequenceArabic) {
                  arabicWordChars.push(sequenceArabic);
                  i += 2; lastSimpleVowelLatinChar = null; continue;
              }
         }

         // 'iy' sequence check with randomization
          if (nextTwoChars === 'iy') {
              const chosenAlternative = Math.random() < 0.5 ? 'ِی' : alternativeMarks['alt_iy']; // 50% chance for ٖی
              arabicWordChars.push(chosenAlternative);
              i += 2;
              lastSimpleVowelLatinChar = null; // Sequences reset vowel tracking
              continue;
          }


        // 2. Handle VOWEL + N/Ñ pair (Tanwin Alternative or Standard C+N+Sukun)
         const isPotentialVowelNNPair = latinVowels.has(char) && (nextChar === 'n' || nextChar === 'ñ') && (i + 1 < latinWord.length);
         // This rule applies to V+N/Ñ pairs *not* at the very start (i > 0) AND not followed by another vowel
         if (isPotentialVowelNNPair && i > 0) {
             const nextNextChar = latinWord[i + 2];
             const isFollowedByVowel = (i + 2 < latinWord.length) && latinVowels.has(nextNextChar);

             // This pair is eligible for the internal Tanwin alternative IF NOT followed by a vowel
             if (!isFollowedByVowel) {
                 const useTanwinAlternative = Math.random() < 0.5; // 50% chance

                 if (useTanwinAlternative) {
                     // Determine Tanwin mark based on the vowel character
                     const tanwinType = latinVowelToTypeForTanwin[char];
                     const tanwinMark = tanwinMap[tanwinType]; // e.g., 'ً', 'ٌ', 'ٍ'

                     if (tanwinMark) {
                          arabicWordChars.push(tanwinMark);
                          lastSimpleVowelLatinChar = null; // Tanwin replaces vowel + consonant info
                     } else {
                         // Fallback to standard if Tanwin map fails for this vowel type
                          let standardVowelMark = vowelsShortDiacritic[char];
                          if ((char === 'i' || char === 'í' || char === 'î') && standardVowelMark === 'ِ') { standardVowelMark = Math.random() < 0.5 ? alternativeMarks['alt_i'] : 'ِ'; } // 50% chance for ٖ

                         if (standardVowelMark) arabicWordChars.push(standardVowelMark);
                         const arabicConsonant = consonantsBase[nextChar]; // 'n' or 'ñ' -> 'ن' or 'ڭ'
                         arabicWordChars.push(arabicConsonant);
                         arabicWordChars.push('ْ'); // Add Sukun
                         lastSimpleVowelLatinChar = char; // Keep vowel info for potential END-OF-WORD Tanwin later
                     }
                     i += 2; // Processed both Latin chars (Vowel + N/Ñ)
                     continue; // Move to next Latin char index i+2

                 } else { // Randomly chose standard representation (50% chance)
                      let standardVowelMark = vowelsShortDiacritic[char];
                      if ((char === 'i' || char === 'í' || char === 'î') && standardVowelMark === 'ِ') { standardVowelMark = Math.random() < 0.5 ? alternativeMarks['alt_i'] : 'ِ';} // 50% chance for ٖ

                      if (standardVowelMark) arabicWordChars.push(standardVowelMark);
                      const arabicConsonant = consonantsBase[nextChar]; // 'n' or 'ñ' -> 'ن' or 'ڭ'
                      arabicWordChars.push(arabicConsonant);
                      arabicWordChars.push('ْ'); // Add Sukun
                      lastSimpleVowelLatinChar = char; // Keep vowel info for potential END-OF-WORD Tanwin later

                     i += 2; // Processed both Latin chars (Vowel + N/Ñ)
                     continue; // Move to next Latin char index i+2
                 }
             } else if (isPotentialVowelNNPair && i === 0) { // *** ADDED CASE: Vowel+N/Ñ at the beginning ***
                   // Always force standard CVn representation at the start
                   let standardVowelMark = vowelsShortDiacritic[char];
                    // Apply initial vowel restrictions for the mark itself
                   if (char === 'a' || char === 'á') { standardVowelMark = 'َ'; }
                   else if (char === 'i' || char === 'í' || char === 'î') { standardVowelMark = 'ِ'; }

                   // Add the initial base (ا or ء) followed by the standard mark
                   const initialBase = Math.random() < 0.5 ? 'ا' : 'ء';
                   arabicWordChars.push(initialBase);
                   if (standardVowelMark) {
                       arabicWordChars.push(standardVowelMark);
                   }

                   // Then add the N/Ñ consonant and Sukun
                   const arabicConsonant = consonantsBase[nextChar]; // 'n' or 'ñ' -> 'ن' or 'ڭ'
                   arabicWordChars.push(arabicConsonant);
                   arabicWordChars.push('ْ'); // Add Sukun

                   lastSimpleVowelLatinChar = char; // Keep vowel info for potential END-OF-WORD Tanwin later

                   i += 2; // Processed both Latin chars (Vowel + N/Ñ)
                   continue; // Move to next Latin char index i+2
             }
        } // End Rule 2 (VOWEL + N/Ñ pair)


        // 3. Handle Single Vowels (Applies if not part of Sequence or Vowel+N/Ñ pair that was handled by 'continue')
        // This rule is now for vowels *after* the first character.
        const isCurrentCharVowel = latinVowels.has(char);
         if (isCurrentCharVowel) {
              let addedSpecialCase = false; // Flag for specific vowel handling paths within this block

              // --- ّ+ا+ِ Rule: If Shadda (ّ) is followed by Kasra (ِ), insert Alef (ا) ---
             if ( (char === 'i' || char === 'í' || char === 'î') && arabicWordChars.length > 0 && arabicWordChars[arabicWordChars.length - 1] === 'ّ') {
                 arabicWordChars.splice(arabicWordChars.length, 0, 'ا', 'ِ'); // Insert 'ا' then 'ِ'
                 addedSpecialCase = true;
                 lastSimpleVowelLatinChar = char;
             }
            // --- End of ّ+ا+ِ Rule ---

            // --- Vowel After Extender Sequence Handling (ُوِ, ِیَ etc.) ---
            if (!addedSpecialCase) {
                 const endOfArabic = arabicWordChars.join(''); const sequenceEndings = ['َآ', 'ِىٓ', 'ُو', 'َا', 'ِی', 'ٰ', 'ٖ', 'َو', 'َی', 'ٰا', 'ٰو', 'ٰی', 'ٖی'];
                 let sequenceMatchedEnding: string | null = null;
                 for(const seq of sequenceEndings) { if (endOfArabic.endsWith(seq)) { sequenceMatchedEnding = seq; break; } }

                if (sequenceMatchedEnding) {
                    let markToAttach = vowelsShortDiacritic[char];

                     // --- Apply Randomization for 'a' or 'á' after Sequence ---
                     if (char === 'a') { const alternatives = aDecorationAlternativesForA; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                     else if (char === 'á') { const alternatives = aDecorationAlternativesForÁ; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                      // --- End Randomization for 'a'/'á' ---

                   // --- Apply Randomization for i/í/î after Sequence ---
                    if ((char === 'i' || char === 'í' || char === 'î') && markToAttach === 'ِ') {
                         if (Math.random() < 0.5) {
                             markToAttach = alternativeMarks['alt_i']; // Use ٖ 50% of the time
                         }
                    }
                   // --- End Randomization for i/í/î ---

                    if (markToAttach) { arabicWordChars.push(markToAttach); addedSpecialCase = true; lastSimpleVowelLatinChar = char; }
                    else { lastSimpleVowelLatinChar = null; addedSpecialCase = true; }
                }
            }
            // --- End Vowel After Extender Sequence Handling ---

            // --- Vowel After Vowel ('ا' Insertion) Handling ---
             if (!addedSpecialCase && prevLatin !== null && (latinVowels.has(prevLatin) || (prevLatin === 'n' || prevLatin === 'ñ')) && !latinVowelSequences.has(prevLatin + char) && nextTwoChars !== 'iy') { // Exclude 'iy' as it's handled as a sequence
                if (prevLatin !== null && latinVowels.has(prevLatin) && !latinVowelSequences.has(prevLatin + char) && nextTwoChars !== 'iy') {
                     arabicWordChars.splice(arabicWordChars.length, 0, 'ا'); // Insert 'ا' at the end
                     const alefIndex = arabicWordChars.length - 1; // Index of the inserted 'ا'
                     let markToAttach = vowelsShortDiacritic[char];
                      // Apply randomization for 'a' or 'á'
                      if (char === 'a') { const alternatives = aDecorationAlternativesForA; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                      else if (char === 'á') { const alternatives = aDecorationAlternativesForÁ; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                       // Apply randomization for i/í/î
                       if ((char === 'i' || char === 'í' || char === 'î') && markToAttach === 'ِ') { if (Math.random() < 0.5) { markToAttach = alternativeMarks['alt_i']; } }

                     if (markToAttach) { arabicWordChars.splice(alefIndex + 1, 0, markToAttach); lastSimpleVowelLatinChar = char; }
                     else { lastSimpleVowelLatinChar = null; }
                     addedSpecialCase = true;
                }
            }
            // --- End Vowel After Vowel Handling ---

           // --- Standard Single Vowel Handling (Applies only if not handled by special cases like initial or sequences) ---
           if (!addedSpecialCase) {
               let attachIndex = findLastDiacriticAttachPointIndex(arabicWordChars);
                if (attachIndex === -2) { lastSimpleVowelLatinChar = null; }
                else if (attachIndex >= 0) {
                    const insertIndex = attachIndex + 1;
                    if (insertIndex < arabicWordChars.length && isBlockingInsertion(arabicWordChars[insertIndex])) { lastSimpleVowelLatinChar = null; }
                    else {
                        let markToAttach = vowelsShortDiacritic[char];
                         // --- Apply Randomization for 'a' or 'á' ---
                         if (char === 'a') { const alternatives = aDecorationAlternativesForA; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                        else if (char === 'á') { const alternatives = aDecorationAlternativesForÁ; const numAlternatives = alternatives.length; const randomChoice = Math.random(); const step = 1 / numAlternatives; let chosenAlternative = alternatives[0]; for (let k = 0; k < numAlternatives; k++) { if (randomChoice < step * (k + 1)) { chosenAlternative = alternatives[k]; break; } } markToAttach = chosenAlternative; }
                         // --- End Randomization for 'a'/'á' ---

                         // --- Apply Randomization for i/í/î ---
                         if ((char === 'i' || char === 'í' || char === 'î') && markToAttach === 'ِ') { if (Math.random() < 0.5) { markToAttach = alternativeMarks['alt_i']; } }
                         // --- End Randomization for i/í/î ---

                        if (markToAttach) { arabicWordChars.splice(insertIndex, 0, markToAttach); lastSimpleVowelLatinChar = char; }
                        else { lastSimpleVowelLatinChar = null; }
                    }
                } else { lastSimpleVowelLatinChar = null; }
           } // End Standard Single Vowel Handling

             i++; // Increment after processing the single vowel
             continue; // Move to next Latin char
         } // End Rule 3 (Single Vowel)


        // 4. Handle Single Consonants (Applies if not part of Sequence or Vowel+N/Ñ pair that was handled by 'continue')
        let arabicConsonant = consonantsBase[char];

        // Handle g/k using the helper function BEFORE pushing the consonant
        if (char === 'g' || char === 'k') {
            arabicConsonant = getArabicGK(char, latinWord, i, latinVowels, hardVowelRuleSet, softVowelRuleSet);
        }

        if (arabicConsonant) {
            arabicWordChars.push(arabicConsonant);

            // --- Add Intermediate Sukun ---
            // Add Sukun UNLESS it's the very last character of the word OR
            // the next Latin character is a vowel
            const isLastLatinChar = (i === latinWord.length - 1);
            const nextLatinIsVowel = !isLastLatinChar && latinVowels.has(latinWord[i+1]);

             if (!isLastLatinChar && !nextLatinIsVowel) {
                 arabicWordChars.push('ْ');
             }
            // --- End Add Intermediate Sukun ---

            i++; // Increment after processing the single consonant
            continue; // Move to next Latin char
        }

        // 5. Add any other unmapped characters as is (Fallback)
        arabicWordChars.push(latinWord[i]);
        i++;
        lastSimpleVowelLatinChar = null; // Reset vowel tracking if an unexpected character appears
        continue; // Move to next Latin char
    } // End while loop through word

    return { arabicChars: arabicWordChars, lastSimpleVowelLatinChar: lastSimpleVowelLatinChar };
}


// Helper to apply final mark (Sukūn or Tanwin alternative) to the last consonant if needed.
function applyFinalMarkToLastConsonant(arabicWordChars: string[], latinWord: string, lastSimpleVowelLatinChar: string | null, needsTanwin: boolean): string {
    const resultChars = [...arabicWordChars]; // Clone the array to modify it
    const len = resultChars.length;


    // Find the index of the last character in the Arabic word that is a base consonant.
    let lastConsonantIndex = -1;
    for (let k = len - 1; k >= 0; k--) {
        if (allArabicConsonants.has(resultChars[k])) {
            lastConsonantIndex = k;
            break;
        }
    }

    // If no consonant found, return as is.
    if (lastConsonantIndex === -1) {
         return resultChars.join('');
    }

     const lastConsonant = resultChars[lastConsonantIndex];
     const charAfterLastConsonant = resultChars[lastConsonantIndex + 1]; // Character immediately following the last consonant

    const isFollowedByNonSukunPreventingMark = isPreventingMarkOrExtender(charAfterLastConsonant) && charAfterLastConsonant !== 'ْ';

    if (isFollowedByNonSukunPreventingMark) {
         return resultChars.join(''); // Return array as is, final vocalization is already present.
    }

    // If we reach here, the last consonant is *not* followed by a non-Sukun preventing mark.
    // It might be followed by an intermediate Sukun. We need to remove it before adding the *correct* final mark.
     if (charAfterLastConsonant === 'ْ') {
         resultChars.splice(lastConsonantIndex + 1, 1); // Remove the intermediate Sukun
     }


    // --- Check for single-consonant word exception (C V N/Ñ) ---
      let forceSukūn = false;
       // Check if the original Latin word is exactly 3 characters (C V N/Ñ pattern)
      const originalLen = latinWord.length;
      if (
         originalLen === 3 &&
         consonantsBase[latinWord[0]] !== undefined && // First char is a consonant
         latinVowels.has(latinWord[1]) && // Second char is a vowel
         (latinWord[2] === 'n' || latinWord[2] === 'ñ') // Third char is n or ñ
      ) {
          if (lastConsonant === 'ن' || lastConsonant === 'ڭ') {
               forceSukūn = true;
          }
      }
      // --- End of C V N/Ñ Exception ---


     // --- Determine and apply the final mark (Sukūn or END-OF-WORD Tanwin) ---
     const finalMarkInsertionIndex = lastConsonantIndex + 1;
     let finalMarkToInsert: string | null = null;

     if (forceSukūn || !needsTanwin) {
         // Apply Sukūn
         finalMarkToInsert = 'ْ';

     } else { // needsTanwin is true AND not forcing Sukun
         // Apply END-OF-WORD Tanwin alternative based on last simple vowel Latin character
         let tanwinType: string | null = null;
         if (lastSimpleVowelLatinChar !== null) {
             tanwinType = latinVowelToTypeForTanwin[lastSimpleVowelLatinChar];
         }

         if (tanwinType && tanwinMap[tanwinType]) {
             finalMarkToInsert = tanwinMap[tanwinType];
         } else {
             // Fallback to standard Sukūn if no relevant vowel type found
             finalMarkToInsert = 'ْ';
         }
     }

     // Insert the determined final mark (if any) after the last consonant.
     if (finalMarkToInsert) {
         resultChars.splice(finalMarkInsertionIndex, 0, finalMarkToInsert);
     }

    return resultChars.join('');
}

export const transliterateToArabic = (latin: string): string => {
    const segments = splitIntoWordsAndSeparators(latin); // Split into words and separators

     let finalArabicOutput = "";
     let pendingWordArabic: string[] | null = null; // Store Array of Arabic chars for the word before a separator
     let pendingWordLatin: string | null = null; // Store the original Latin word string (lowercase)
     let pendingWordVowelLatinChar: string | null = null; // Store the lastSimpleVowelLatinChar for the pending word


     for (let i = 0; i < segments.length; i++) {
         const currentSegment = segments[i];
         const isCurrentSegmentWord = currentSegment.length > 0 && isLatinLetter(currentSegment[0]);
         const isLastSegment = (i === segments.length - 1);

         if (pendingWordArabic !== null && pendingWordLatin !== null) {
              const isCurrentSegmentPunctuation = (currentSegment !== null && currentSegment.length > 0 && punctuationSymbolsSet.has(currentSegment[0]));
              const pendingWordNeedsTanwin = isCurrentSegmentPunctuation || isLastSegment;

              const wordWithFinalMark = applyFinalMarkToLastConsonant(pendingWordArabic, pendingWordLatin, pendingWordVowelLatinChar, pendingWordNeedsTanwin);
              finalArabicOutput += wordWithFinalMark;

              pendingWordArabic = null;
              pendingWordLatin = null;
              pendingWordVowelLatinChar = null;
         }

         if (isCurrentSegmentWord) {
             const { arabicChars, lastSimpleVowelLatinChar: currentWordVowelLatinChar } = transliterateWord(currentSegment);
             pendingWordArabic = arabicChars;
             pendingWordLatin = currentSegment;
             pendingWordVowelLatinChar = currentWordVowelLatinChar;

             if (isLastSegment) {
                  const wordWithFinalMark = applyFinalMarkToLastConsonant(pendingWordArabic, pendingWordLatin, pendingWordVowelLatinChar, true); // true -> gets END-OF-WORD Tanwin
                  finalArabicOutput += wordWithFinalMark;
                  pendingWordArabic = null;
                  pendingWordLatin = null;
                  pendingWordVowelLatinChar = null;
             }
         } else { // Current segment is a separator
             let mappedSeparator = currentSegment;
             if (currentSegment.length > 0) {
                  const char = currentSegment[0];
                   if (symbolMap[char]) {
                      mappedSeparator = symbolMap[char];
                   } else if (digitMap[char]) {
                        mappedSeparator = digitMap[char];
                   } else if (char === '\n') {
                       mappedSeparator = '\n';
                   }
             } else if (currentSegment === '\n') {
                 mappedSeparator = '\n';
             }
             finalArabicOutput += mappedSeparator;
         }
     }

    return finalArabicOutput;
}
