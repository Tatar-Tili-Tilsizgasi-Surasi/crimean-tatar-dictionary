import React, { useState } from 'react';
import { BackspaceIcon } from './IconComponents';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
}

const crimeanTatarLayout = [
    ['a', 'á', 'b', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h'],
    ['i', 'í', 'î', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ó'],
    ['p', 'r', 's', 'ş', 't', 'u', 'ú', 'v', 'w', 'y', 'z', 'Backspace']
];

const romanianLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'ă', 'î'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ș', 'ț', 'â'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace']
];

type KeyboardType = 'tatar' | 'romanian';

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress }) => {
  const [activeKeyboard, setActiveKeyboard] = useState<KeyboardType>('tatar');

  const keyboardLayout = activeKeyboard === 'tatar' ? crimeanTatarLayout : romanianLayout;

  return (
    <div className="bg-gray-200 dark:bg-slate-700 p-2 rounded-lg shadow-inner mt-2">
      <div className="flex justify-center gap-2 mb-2">
        <button
          onClick={() => setActiveKeyboard('tatar')}
          type="button"
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-700 ${
            activeKeyboard === 'tatar'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
          }`}
          aria-pressed={activeKeyboard === 'tatar'}
        >
          Crimean Tatar
        </button>
        <button
          onClick={() => setActiveKeyboard('romanian')}
          type="button"
          className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-700 ${
            activeKeyboard === 'romanian'
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'
          }`}
          aria-pressed={activeKeyboard === 'romanian'}
        >
          Romanian
        </button>
      </div>

      {keyboardLayout.map((row, rowIndex) => (
        <div key={`${activeKeyboard}-${rowIndex}`} className="flex justify-center gap-1 my-1 flex-wrap">
          {row.map(char => {
            const isSpecialKey = char.length > 1;
            return (
                <button
                key={char}
                onClick={() => onKeyPress(char)}
                type="button"
                className={`
                    h-8 sm:h-9 rounded-md flex items-center justify-center font-bold text-sm sm:text-base 
                    transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-offset-gray-200 dark:focus:ring-offset-slate-700 focus:ring-blue-500 
                    bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 
                    hover:bg-blue-100 dark:hover:bg-slate-600 shadow-sm 
                    hover:scale-105 active:scale-95
                    ${isSpecialKey ? 'w-12 px-2' : 'w-8 sm:w-9'}
                `}
                aria-label={char === 'Backspace' ? 'Delete last character' : `Insert character ${char}`}
                >
                {char === 'Backspace' ? <BackspaceIcon className="h-5 w-5" /> : char}
                </button>
            );
        })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard;
