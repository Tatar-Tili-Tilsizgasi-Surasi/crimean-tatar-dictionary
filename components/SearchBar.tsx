import React from 'react';
import { useState, useRef } from 'react';
import { SearchIcon, KeyboardIcon } from './IconComponents';
import VirtualKeyboard from './VirtualKeyboard';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [term, setTerm] = useState('');
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(term);
  };

  const handleVirtualKeyPress = (char: string) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const selectionStart = input.selectionStart ?? 0;
    const selectionEnd = input.selectionEnd ?? 0;
    
    let newTerm: string;
    let newCursorPosition: number;

    if (char === 'Backspace') {
      if (selectionStart === selectionEnd) { // No selection
        if (selectionStart === 0) return; // Nothing to delete
        newTerm = term.substring(0, selectionStart - 1) + term.substring(selectionEnd);
        newCursorPosition = selectionStart - 1;
      } else { // Text is selected
        newTerm = term.substring(0, selectionStart) + term.substring(selectionEnd);
        newCursorPosition = selectionStart;
      }
    } else { // It's a character to insert
      newTerm = term.substring(0, selectionStart) + char + term.substring(selectionEnd);
      newCursorPosition = selectionStart + char.length;
    }
    
    setTerm(newTerm);

    // After state update, focus and set cursor position
    setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search for a word in Crimean Tatar or Romanian..."
            className="block w-full p-4 pl-10 pr-36 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-shadow duration-200 focus:shadow-lg"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
             <button
                type="button"
                onClick={() => setIsKeyboardOpen(!isKeyboardOpen)}
                className={`p-2 rounded-lg text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isKeyboardOpen ? 'bg-blue-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400' : ''}`}
                aria-label="Toggle virtual keyboard"
                aria-pressed={isKeyboardOpen}
            >
                <KeyboardIcon className="h-5 w-5"/>
            </button>
            <button
              type="submit"
              className="text-white ml-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>
       {isKeyboardOpen && <VirtualKeyboard onKeyPress={handleVirtualKeyPress} />}
    </div>
  );
};

export default SearchBar;