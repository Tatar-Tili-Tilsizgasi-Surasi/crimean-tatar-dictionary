import React, { useState } from 'react';
import { translateText } from '../services/translationService';
import { SwapIcon } from './IconComponents';

const Translator: React.FC = () => {
    const [sourceLang, setSourceLang] = useState<'ct' | 'ro'>('ct');
    const [targetLang, setTargetLang] = useState<'ct' | 'ro'>('ro');
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        if (!sourceText.trim()) return;

        setIsLoading(true);
        setError(null);
        setTranslatedText('');

        try {
            const result = await translateText(sourceText, sourceLang, targetLang);
            setTranslatedText(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSwapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        // Also swap the text
        const currentSource = sourceText;
        setSourceText(translatedText);
        setTranslatedText(currentSource);
    };

    const getLanguageName = (langCode: 'ct' | 'ro') => {
        return langCode === 'ct' ? 'Crimean Tatar' : 'Romanian';
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <header className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-400">
                    Translator
                </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                {/* Source Language */}
                <div className="flex flex-col">
                    <label htmlFor="source-text" className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{getLanguageName(sourceLang)}</label>
                    <textarea
                        id="source-text"
                        rows={8}
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-shadow duration-200 focus:shadow-lg p-3"
                        placeholder="Enter text to translate..."
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                {/* Target Language */}
                <div className="flex flex-col">
                    <label htmlFor="translated-text" className="font-semibold mb-2 text-gray-700 dark:text-gray-300">{getLanguageName(targetLang)}</label>
                    <div
                        id="translated-text"
                        aria-live="polite"
                        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-slate-900/50 dark:border-slate-600 dark:text-white p-3 min-h-[178px]"
                    >
                      {isLoading ? <span className="text-gray-400">Translating...</span> : translatedText}
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <div className="mt-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={handleSwapLanguages}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Swap languages"
                >
                    <SwapIcon className="h-6 w-6" />
                </button>
                <button
                    type="button"
                    onClick={handleTranslate}
                    disabled={isLoading || !sourceText.trim()}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors min-w-[150px]"
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Translating...
                        </>
                    ) : 'Translate'}
                </button>
            </div>
        </div>
    );
};

export default Translator;