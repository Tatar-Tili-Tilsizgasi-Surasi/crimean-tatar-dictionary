import React from 'react';
import { DictionaryEntry } from '../types';

interface ResultCardProps {
  entry: DictionaryEntry;
  searchTerm: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ entry, searchTerm }) => {
  const highlightSearchTerm = (text: string, term: string) => {
    if (!term.trim()) return text;
    // Escape special characters for regex
    const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    if (!escapedTerm) {
        return text;
    }
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1">
      <h3 className="text-xl font-bold text-blue-800 dark:text-blue-400 mb-2 flex items-baseline">
        <span>{highlightSearchTerm(entry.word, searchTerm)}</span>
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
        {entry.abbreviation && (
          <span className="mr-1">
            {entry.abbreviation}
          </span>
        )}
        {highlightSearchTerm(entry.definition, searchTerm)}
      </p>
    </div>
  );
};

export default ResultCard;