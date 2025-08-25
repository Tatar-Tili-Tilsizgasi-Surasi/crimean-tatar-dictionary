
import React from 'react';
import { useState, useCallback } from 'react';
import { DictionaryEntry } from './types';
import { searchDictionary, getEntriesByLetter } from './services/dictionaryService';
import SearchBar from './components/SearchBar';
import ResultCard from './components/ResultCard';
import { BookOpenIcon, QuestionMarkCircleIcon, InformationCircleIcon } from './components/IconComponents';
import AbbreviationsModal from './components/AbbreviationsModal';
import SourcesModal from './components/SourcesModal';

const App: React.FC = () => {
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isAbbreviationsModalOpen, setIsAbbreviationsModalOpen] = useState(false);
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  
  const alphabet = ['a', 'á', 'b', 'ç', 'd', 'e', 'f', 'g', 'ğ', 'h', 'i', 'í', 'î', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ó', 'p', 'r', 's', 'ş', 't', 'u', 'ú', 'v', 'w', 'y', 'z'];

  const handleSearch = useCallback(async (term: string) => {
    setIsLoading(true);
    setSearchedTerm(term);
    setSelectedLetter(null);
    const searchResults = await searchDictionary(term);
    setResults(searchResults);
    setIsLoading(false);
  }, []);

  const handleLetterClick = useCallback(async (letter: string) => {
    setIsLoading(true);
    setSearchedTerm(null);
    setSelectedLetter(letter);
    const letterResults = await getEntriesByLetter(letter);
    setResults(letterResults);
    setIsLoading(false);
  }, []);

  const getResultTerm = () => searchedTerm || (selectedLetter ? `words starting with '${selectedLetter}'` : '');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 font-sans text-gray-900 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <BookOpenIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-white ml-3">
              Crimean Tatar Dictionary
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            A searchable Crimean Tatar - Romanian Dictionary
          </p>
        </header>

        <main>
          <div className="mb-4 sticky top-4 z-10 bg-gray-100 dark:bg-slate-900/80 backdrop-blur-sm py-2 -mx-2 px-2 rounded-lg">
             <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>

          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 my-6" role="navigation" aria-label="Alphabetical index">
            {alphabet.map(letter => (
                <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-900 focus:ring-blue-500 ${
                        selectedLetter === letter 
                            ? 'bg-blue-600 text-white shadow-md scale-110' 
                            : 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 shadow-sm hover:scale-105'
                    }`}
                    aria-pressed={selectedLetter === letter}
                >
                    {letter.toUpperCase()}
                </button>
            ))}
          </div>

          <div className="flex justify-end items-center gap-4 mb-8 px-2">
            <button
                onClick={() => setIsSourcesModalOpen(true)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 transition-colors"
                aria-haspopup="dialog"
            >
                <InformationCircleIcon className="h-5 w-5 mr-1" />
                View Sources
            </button>
            <button
                onClick={() => setIsAbbreviationsModalOpen(true)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1 transition-colors"
                aria-haspopup="dialog"
            >
                <QuestionMarkCircleIcon className="h-5 w-5 mr-1" />
                View Abbreviations
            </button>
          </div>
         
          <div className="results-container">
            {isLoading && (
              <div className="text-center p-10">
                <p className="text-lg animate-pulse">Searching...</p>
              </div>
            )}

            {!isLoading && (searchedTerm !== null || selectedLetter !== null) && results.length === 0 && (
              <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">No results found for "{getResultTerm()}"</h3>
                <p className="text-gray-600 dark:text-gray-400">Please try a different search term or letter.</p>
              </div>
            )}

            {!isLoading && searchedTerm === null && selectedLetter === null && (
               <div className="text-center p-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">Welcome to the Dictionary</h3>
                <p className="text-gray-600 dark:text-gray-400">Enter a word above or select a letter to begin your search.</p>
              </div>
            )}
            
            {!isLoading && results.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Found {results.length} results for "{getResultTerm()}".</p>
                {results.map((entry, index) => (
                  <ResultCard key={`${entry.word}-${index}`} entry={entry} searchTerm={searchedTerm || ''} />
                ))}
              </div>
            )}
          </div>
        </main>
        <footer className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>Powered by React & Tailwind CSS.</p>
          <p>You can find the source of this dictionary on <a href="https://github.com/Tatar-Tili-Tilsizgasi-Surasi/crimean-tatar-dictionary" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub</a>.</p>
        </footer>
      </div>
      <AbbreviationsModal isOpen={isAbbreviationsModalOpen} onClose={() => setIsAbbreviationsModalOpen(false)} />
      <SourcesModal isOpen={isSourcesModalOpen} onClose={() => setIsSourcesModalOpen(false)} />
    </div>
  );
};

export default App;