import React from 'react';
import { BookOpenIcon, CloseIcon, InformationCircleIcon, QuestionMarkCircleIcon } from './IconComponents';

interface SiteNavProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: 'dictionary' | 'translator') => void;
  onOpenAbbreviations: () => void;
  onOpenSources: () => void;
}

const SiteNav: React.FC<SiteNavProps> = ({ isOpen, onClose, onNavigate, onOpenAbbreviations, onOpenSources }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Navigation Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sitemap-title"
      >
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700">
                <h2 id="sitemap-title" className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
                    <BookOpenIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
                    Sózlík Menu
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Close menu"
                >
                    <CloseIcon className="h-6 w-6" />
                </button>
            </header>

            <ul className="flex-grow p-4 space-y-2">
                <li>
                    <button onClick={() => { onNavigate('dictionary'); onClose(); }} className="w-full flex items-center px-4 py-3 text-lg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <BookOpenIcon className="h-6 w-6 mr-3" /> Dictionary
                    </button>
                </li>
                <li>
                    <button onClick={() => { onNavigate('translator'); onClose(); }} className="w-full flex items-center px-4 py-3 text-lg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <div className="w-6 mr-3"></div> Translator
                    </button>
                </li>
                <li className="pt-2 border-t border-gray-200 dark:border-slate-700"></li>
                <li>
                    <button onClick={() => { onOpenAbbreviations(); onClose(); }} className="w-full flex items-center px-4 py-3 text-lg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <QuestionMarkCircleIcon className="h-6 w-6 mr-3" /> Abbreviations
                    </button>
                </li>
                 <li>
                    <button onClick={() => { onOpenSources(); onClose(); }} className="w-full flex items-center px-4 py-3 text-lg text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                        <InformationCircleIcon className="h-6 w-6 mr-3" /> Sources
                    </button>
                </li>
            </ul>

            <footer className="p-4 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700">
                <p>Alpha Copy of Sózlík</p>
            </footer>
        </div>
      </nav>
    </>
  );
};

export default SiteNav;