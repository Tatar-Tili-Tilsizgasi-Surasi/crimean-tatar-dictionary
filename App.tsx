import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex items-center justify-center p-4 font-sans text-center">
      <div className="max-w-xl bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-xl shadow-lg">
        <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 leading-relaxed">
          This project has been moved to the{' '}
          <a 
            href="https://crimean-tatar-romania-corpus.netlify.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-bold text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            Crimean Tatar (Romania) Language Corpus
          </a>.
        </p>
      </div>
    </div>
  );
};

export default App;
