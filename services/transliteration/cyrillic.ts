export const transliterateToCyrillic = (latin: string): string => {
    let transliteratedText = "";

    // Diagraphs must be checked before single letters
    const diagraphs: { [key: string]: string } = {
        'Ya': 'Я', 'YA': 'Я',
        'ya': 'я', 'Yu': 'Ю', 'YU': 'Ю', 'yu': 'ю', 'Yú': 'Ю', 'YÚ': 'Ю',
        'yú': 'ю', 'Ts': 'Ц', 'TS': 'Ц', 'ts': 'ц', 'Şç': 'Щ', 'ŞÇ': 'Щ', 'şç': 'щ'
    };

    const letters: { [key: string]: string } = {
        'A': 'А', 'a': 'а', 'Á': 'Ә', 'á': 'ә', 'B': 'Б', 'b': 'б',
        'Ç': 'Ч', 'ç': 'ч', 'D': 'Д', 'd': 'д', 'E': 'Э', 'e': 'э',
        'F': 'Ф', 'f': 'ф', 'G': 'Г', 'g': 'г', 'Ğ': 'Җ', 'ğ': 'җ',
        'H': 'Х', 'h': 'х', 'I': 'И', 'i': 'и',
        'Î': 'Ы', 'î': 'ы', 'Í': 'І', 'í': 'і',
        'J': 'Ж', 'j': 'ж', 'K': 'К', 'k': 'к',
        'L': 'Л', 'l': 'л', 'M': 'М', 'm': 'м',
        'N': 'Н', 'n': 'н', 'Ñ': 'Ң', 'ñ': 'ң', 'O': 'О', 'o': 'о', 'Ó': 'Ө', 'ó': 'ө',
        'P': 'П', 'p': 'п', 'R': 'Р', 'r': 'р',
        'S': 'С', 's': 'с', 'Ş': 'Ш', 'ş': 'ш',
        'T': 'Т', 't': 'т', 'U': 'У', 'u': 'у', 'Ú': 'Ү', 'ú': 'ү', 'V': 'В', 'v': 'в',
        'W': 'Ў', 'w': 'ў', 'Y': 'Й', 'y': 'й', 'Z': 'З', 'z': 'з'
    };

    for (let i = 0; i < latin.length; i++) {
        const currentChar = latin[i];
        const nextChar = latin[i + 1];

        if (currentChar === "'") {
            continue;
        }

        if (nextChar !== undefined) {
             const diagraph = currentChar + nextChar;
             if (diagraphs.hasOwnProperty(diagraph)) {
                transliteratedText += diagraphs[diagraph];
                i++;
                continue;
            }
        }

        if (letters.hasOwnProperty(currentChar)) {
            transliteratedText += letters[currentChar];
        } else {
            transliteratedText += currentChar;
        }
    }

    return transliteratedText;
}
