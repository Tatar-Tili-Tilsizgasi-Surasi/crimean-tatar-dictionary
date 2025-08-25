import React, { useState, useEffect } from 'react';
import { DictionaryEntry } from '../types';
import { transliterateToArabic } from '../services/transliteration/arabic';
import { transliterateToCyrillic } from '../services/transliteration/cyrillic';
import { transliterateToOldTurkic } from '../services/transliteration/oldTurkic';


interface ResultCardProps {
  entry: DictionaryEntry;
  searchTerm: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ entry, searchTerm }) => {
  const [arabic, setArabic] = useState('');
  const [cyrillic, setCyrillic] = useState('');
  const [oldTurkic, setOldTurkic] = useState('');

  useEffect(() => {
    const wordToTransliterate = entry.word.replace(/\s*\(.*\)\s*/, '').trim();
    if (wordToTransliterate) {
        setArabic(transliterateToArabic(wordToTransliterate));
        setCyrillic(transliterateToCyrillic(wordToTransliterate));
        setOldTurkic(transliterateToOldTurkic(wordToTransliterate));
    } else {
        setArabic('');
        setCyrillic('');
        setOldTurkic('');
    }
  }, [entry.word]);

  const formatText = (text: string, term: string): React.ReactNode => {
    if (!text) return text;

    const highlight = (textToHighlight: string, keyPrefix: string): React.ReactNode[] => {
      if (!term.trim() || !textToHighlight) {
        return [textToHighlight];
      }
      const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedTerm})`, 'gi');
      if (!escapedTerm) {
        return [textToHighlight];
      }

      return textToHighlight.split(regex).map((part, index) => {
        if (index % 2 === 1) { // Matched parts are at odd indices
          return (
            <span key={`${keyPrefix}-${index}`} className="bg-blue-100 dark:bg-blue-900/50 rounded-sm">
              {part}
            </span>
          );
        }
        return part;
      });
    };

    const bracketRegex = /(\([^)]+\))/g;
    return text.split(bracketRegex).flatMap<React.ReactNode>((part, index) => {
      if (!part) return [];
      if (index % 2 === 1) { // bracketed part
        return [<i key={`i-${index}`}>{highlight(part, `h-${index}`)}</i>];
      } else { // non-bracketed part
        return highlight(part, `h-${index}`);
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2">
        {formatText(entry.word, searchTerm)}
      </h3>

      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700 mt-4 pt-4">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 items-baseline">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Cyrillic:</span>
            <span>{cyrillic}</span>
            
            <span className="font-semibold text-gray-600 dark:text-gray-300">Arabic:</span>
            <span dir="rtl" className="text-right w-full block">{arabic}</span>
            
            <span className="font-semibold text-gray-600 dark:text-gray-300">Old Turkic:</span>
            <span dir="rtl" className="text-right w-full block">{oldTurkic}</span>
        </div>
      </div>

      {entry.meanings.map((meaning, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex items-baseline text-md font-semibold text-gray-700 dark:text-gray-300">
            {meaning.partNumber && <span className="mr-2 font-bold">{meaning.partNumber}</span>}
            {meaning.abbreviation && <span className="italic text-gray-500 dark:text-gray-400">{meaning.abbreviation}</span>}
          </div>
          <ol className={`mt-1 text-gray-700 dark:text-gray-300 space-y-1 leading-relaxed ${meaning.definitions.length > 1 ? 'list-decimal list-inside ml-5' : 'list-none'}`}>
            {meaning.definitions.map((def, defIndex) => (
              <li key={defIndex}>
                {formatText(def, searchTerm)}
              </li>
            ))}
          </ol>
        </div>
      ))}

      {entry.examples && entry.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Examples</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 leading-relaxed ml-5">
            {entry.examples.map((example, exampleIndex) => (
              <li key={exampleIndex}>
                {formatText(example, searchTerm)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
