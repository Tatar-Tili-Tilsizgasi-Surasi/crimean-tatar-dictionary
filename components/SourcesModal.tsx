
import React from 'react';
import { CloseIcon } from './IconComponents';

interface SourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sourcesData = [
    {
        title: "Kîrîm tatarşa — Kazakşa Sózlík",
        details: "Taner Murat, CreateSpace, Charleston SC, USA, 2011, ISBN 978-1461083108"
    },
    {
        title: "The Sounds of Tatar Spoken in Romania: The Golden Khwarezmian Language of the Nine Noble Nations",
        details: "Taner Murat, Anticus Press, Constanța, 2018, ISBN 978-606-94509-4-9"
    },
    {
        title: "Phonetic, Phonology and Morphology",
        details: "Enver Mahmut, University of Bucharest, 1975"
    },
    {
        title: "Curs practic de limbă tătară",
        details: "Vuap-Mocanu, Şukran (1985). Curs practic de limbă tătară. Bucharest: University of Bucharest, Faculty of Foreign Languages and Literatures."
    }
];


const SourcesModal: React.FC<SourcesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 id="sources-title" className="text-xl font-bold text-gray-800 dark:text-white">
            Sources
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close sources modal"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto">
            <ul className="space-y-4">
                {sourcesData.map((source, index) => (
                    <li key={index} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0">
                        <h3 className="font-bold text-lg text-blue-800 dark:text-blue-400">{source.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{source.details}</p>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default SourcesModal;
