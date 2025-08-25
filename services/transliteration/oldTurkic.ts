const VOWEL_GLYPHS: { [key: string]: string } = {
    'a': '𐰀', 'á': '𐰀', 'ä': '𐰀', 'e': '𐰀',
    'i': '𐰃', 'í': '𐰃', 'î': '𐰃', 'ı': '𐰃',
    'o': '𐰆', 'u': '𐰆',
    'ó': '𐰇', 'ú': '𐰇', 'ö': '𐰇', 'ü': '𐰇',
};

const HARD_VOWELS = new Set(['a', 'î', 'o', 'u', 'ı']);
const SOFT_VOWELS = new Set(['á', 'ä', 'e', 'i', 'í', 'ó', 'ú', 'ö', 'ü']);
const ALL_VOWELS = new Set([...HARD_VOWELS, ...SOFT_VOWELS]);

const CONSONANT_MAPPING: { [key: string]: { hard: string | string[], soft: string | string[] } } = {
    'b': { hard: '𐰉', soft: '𐰋' },
    'ç': { hard: '𐰲', soft: '𐰲' },
    'd': { hard: '𐰑', soft: '𐰓' },
    'f': { hard: '𐰯', soft: '𐰯' },
    'g': { hard: '𐰍', soft: '𐰏' },
    'ğ': { hard: '𐰖', soft: '𐰘' },
    'h': { hard: '𐰶', soft: '𐰶' },
    'j': { hard: '𐰖', soft: '𐰘' },
    'k': { hard: ['𐰸', '𐰶', '𐰴'], soft: ['𐰜', '𐰝', '𐰚'] },
    'l': { hard: '𐰞', soft: '𐰠' },
    'm': { hard: '𐰢', soft: '𐰢' },
    'n': { hard: '𐰣', soft: '𐰤' },
    'ñ': { hard: '𐰭', soft: '𐰤' },
    'p': { hard: '𐰯', soft: '𐰯' },
    'r': { hard: '𐰺', soft: '𐰼' },
    's': { hard: '𐰽', soft: '𐰾' },
    'ş': { hard: '𐱁', soft: '𐱁' },
    't': { hard: '𐱃', soft: '𐱅' },
    'v': { hard: '𐱈', soft: '𐱈' },
    'z': { hard: '𐰔', soft: '𐰔' },
    'y': { hard: '𐰖', soft: '𐰘' },
    'w': { hard: '𐱈', soft: '𐱈' },
};

const DIGRAPH_MAPPING: { [key: string]: string } = {
    'nğ': '𐰨',
    'lt': '𐰡',
    'ld': '𐰡',
    'nt': '𐰦',
    'nd': '𐰦',
};

const IGNORED_CHARS = new Set(["'", "-"]);
const PUNCTUATION_CHARS = new Set(['.', '?', '!', ',', ':', ';', '"']);
const WORD_SEPARATOR_GLYPH = ' : ';
const PUNCTUATION_GLYPH = '.';

function isVowel(char: string): boolean {
    return ALL_VOWELS.has(char);
}

function isConsonantOrSemivowel(char: string): boolean {
     return CONSONANT_MAPPING.hasOwnProperty(char);
}

function getRandomGlyph(glyphArray: string[]): string {
     if (!Array.isArray(glyphArray) || glyphArray.length === 0) {
         return '';
     }
     const randomIndex = Math.floor(Math.random() * glyphArray.length);
     return glyphArray[randomIndex];
}

function tokenize(text: string, puncSet: Set<string>): string[] {
    const tokens: string[] = [];
    let currentToken = "";
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === ' ') {
            if (currentToken) {
                tokens.push(currentToken);
            }
            tokens.push(' ');
            currentToken = "";
        } else if (puncSet.has(char)) {
             if (currentToken) {
                tokens.push(currentToken);
            }
            tokens.push(char);
            currentToken = "";
        } else {
            currentToken += char;
        }
    }
    if (currentToken) {
        tokens.push(currentToken);
    }
    return tokens;
}

function getWordContext(word: string): 'hard' | 'soft' {
    const cleanedWord = Array.from(word).filter(char => !IGNORED_CHARS.has(char)).join('');
    for (const char of cleanedWord) {
        if (HARD_VOWELS.has(char)) {
            return 'hard';
        } else if (SOFT_VOWELS.has(char)) {
            return 'soft';
        }
    }
    return 'hard';
}

export const transliterateToOldTurkic = (latin: string): string => {
    const latinText = latin.toLowerCase();
    if (!latinText) {
        return "";
    }

    const tokens = tokenize(latinText, PUNCTUATION_CHARS);
    const otTokens: string[] = [];

    for (const token of tokens) {
        if (token === ' ') {
            if (otTokens.length > 0 && otTokens[otTokens.length - 1] !== WORD_SEPARATOR_GLYPH && otTokens[otTokens.length - 1] !== PUNCTUATION_GLYPH) {
                 otTokens.push(WORD_SEPARATOR_GLYPH);
            }
        } else if (PUNCTUATION_CHARS.has(token)) {
            otTokens.push(PUNCTUATION_GLYPH);
        } else if (IGNORED_CHARS.has(token)) {
            continue;
        } else {
            const word = Array.from(token).filter(char => !IGNORED_CHARS.has(char)).join('');

            if (!word) {
                continue;
            }

            const wordContext = getWordContext(word);
            let otWord = "";
            let i = 0;

            while (i < word.length) {
                let char = word[i];
                let handled = false;

                const digraphs = Object.keys(DIGRAPH_MAPPING).sort((a, b) => b.length - a.length);
                for (const digraph of digraphs) {
                    if (i + digraph.length <= word.length && word.substring(i, i + digraph.length) === digraph) {
                        otWord += DIGRAPH_MAPPING[digraph];
                        i += digraph.length;
                        handled = true;
                        break;
                    }
                }

                if (handled) {
                    continue;
                }

                const isInitial = i === 0;
                const isLast = i === word.length - 1;

                if (isVowel(char)) {
                    if (isInitial) {
                        otWord += VOWEL_GLYPHS[char];
                    }
                    else if (isLast && word.length > 1) {
                        otWord += VOWEL_GLYPHS[char];
                    }
                    i++;
                }
                else if (isConsonantOrSemivowel(char)) {
                     const glyphInfo = CONSONANT_MAPPING[char];
                     const glyph = glyphInfo[wordContext];

                     if (Array.isArray(glyph)) {
                         otWord += getRandomGlyph(glyph);
                     } else {
                         otWord += glyph;
                     }
                    i++;
                }
                else {
                    i++;
                }
            }

            if (otWord) {
                otTokens.push(otWord);
            }
        }
    }

    let otText = otTokens.join('');

    otText = otText.replace(new RegExp(WORD_SEPARATOR_GLYPH.trim() + '\\' + PUNCTUATION_GLYPH, 'g'), PUNCTUATION_GLYPH);
    otText = otText.replace(new RegExp('\\' + PUNCTUATION_GLYPH + WORD_SEPARATOR_GLYPH.trim(), 'g'), PUNCTUATION_GLYPH);
    otText = otText.replace(new RegExp('\\' + PUNCTUATION_GLYPH + ' ', 'g'), PUNCTUATION_GLYPH);
    otText = otText.replace(new RegExp(' ' + '\\' + PUNCTUATION_GLYPH, 'g'), PUNCTUATION_GLYPH);

     otText = otText.replace(new RegExp('^' + WORD_SEPARATOR_GLYPH.trim()), '');
     otText = otText.replace(new RegExp(WORD_SEPARATOR_GLYPH.trim() + '$'), '');

    return otText.trim();
}
