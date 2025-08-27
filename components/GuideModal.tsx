
import React, { useState } from 'react';
import { CloseIcon, QuestionMarkCircleIcon } from './IconComponents';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const abbreviationsData = `
acad. termen academic|muwallímatşa
adj. adjectiv|sîfat
adm. administraţie|idareğílík
adv. adverb|rewúş
agr. agricultură|egínğílík
anat. anatomie|uzabílímí
aprox. aproximativ|yakînğa
arab. termen din limba arabă|arap atamasî
arh. termen arhaic|eskí atama
arheol. arheologie|kazîmbílímí
arhit. arhitectură|mimarlîk
art. articol|ílgeş
astr. astronomie|felekiyat
auto. automobilism|maşinaaydamasî
av. aviaţie|tayyareğílík
biol. biologie|ómírbílímí
bis. termen bisericesc|kílse atamasî
bot. botanică|nebatat
card. cardinal|miktar
chim. chimie|kimiya
cinem. cinematografie|deweranğîlîk
col. colectiv|ğîyuw
com. comerţ|satuwanğîlîk
conj. conjuncţie|baylaş
constr. construcţii|inşaat
cron. cronologie|zemaniy sîralama
d. despre|hakkînda
dat. dativ|ğónelíş
dem. demonstrativ|işaret
dim. diminutiv|kíşkeltme
econ. economie|iktisat
electr. electricitate|şagîlgan
ent. entomologie|bóğekbílímí
etc. etcetera|we sayire
expr. expresie|aytîm
f. feminin|ana ğíníslí
fam. termen familiar|teklipsízlík
farm. farmacologie|eğzabílímí
ferov. termen feroviar|temírğol atamasî
fig. termen figurat|meğaz
filoz. filozofie|felsefe
fin. finanţe|maliye
fitop. fitopatologie|nebatatmarazlarî
fiz. fizică|ğismaniyet
fiziol. fiziologie|ğismaniybílím
folc. termen folcloric|kalkbílgísí
fon. fonetică|sesbílgísí
foto. fotografie|resímğílík
gastron. gastronomie|metbe
geogr. geografie|ğeryúzíbílímí
geol. geologie|ğerbílímí
geom. geometrie|hendese
ger. gerunziu|baylam figelí
gram. gramatică|tílsîzgasî
i. intranzitiv|geşírmez
iht. ihtiologie|balîkbílímí
impers. impersonal|hayriyşahsiy
inf. infinitiv|mastar
inform. informatică|seriyelek
interj. interjecţie|nida
interog. interogativ|sorawğî
invar. invariabil|deñíşmez
ist. istorie|tewúke
iz. izafet|izafet
jur. ştiinţe juridice|hukuk
lat. termen din limba latină|látinğe
lingv. lingvistică|tílbílímí
lit. literatură|edebiyat
log. logică|makul
m. masculin|ata ğíníslí
mat. matematică|riyaziyet
mec. mecanică|seriyet
med. medicină|tîp
meteo. meteorologie|hawabílímí
mil. termen militar|askeriye
minr. mineralogie|madenbílímí
mitol. mitologie|efsanelík
mong. termen din limba mongolă|moñgolğa
muz. muzică|muzikiy
n. neutru|ğíníssíz
nav. navigaţie|papîrğîlîk
neg. negativ|bolîmsîz
nehot. nehotărât|belletmez
nom. nominativ|baş kelíş
num. numeral|sayî
ord. ordinal|tertip
orn. ornitologie|kuşbílímí
part. particulă|edat
peior. termen peiorativ|aşalatuwğî
pers. personal|şahsiy
pict. pictură|ressamlîk
pl. plural|kóplík
pol. politică|siyaset
pop. termen popular|kalk tílínde
pos. posesiv|iyelík
prep. prepoziţie|aldedat
pron. pronume|almaşlîk
prsn. termen din limba persană|ağemğe
psih. psihologie|akîlbílímí
pt. pentru|úşún
r. reflexiv|kaytîmlî
radiof. radiofonie|radiyosedalîk
recipr. reciproc|karşîlîklî
redupl. reduplicativ|bírtaalama
reg. regionalism|bólge tílí
rel. relativ|nispiy
relig. religie|diyanet
s. substantiv|ísím
sg. singular|bírlík
şcol. termen şcolar|mektep
t. tranzitiv|geşírgen
teatr. teatru|tiyatro
tehn. tehnică|fen
tel. telecomunicaţii|uzakkaberleşme
text. industrie textilă|tokîmağîlîk
tipogr. tipografie|basîm
topogr. topografie|ğersîzgasî
transp. transporturi|taşîwğîlîk
univ. termen universitar|darúlfúnun
univsl. universal|umum
v. verb|figel
vet. medicină veterinară|baytarlîk
vulg. termen vulgar|kaba
zool. zoologie|haywanatbílímí
`
.trim()
.replace(/Ń/g, 'ţ');

const parsedAbbreviations = abbreviationsData.split('\n').map(line => {
    const [abbrevAndRomanian, crimean] = line.trim().split('|');
    const parts = abbrevAndRomanian.trim().split(/\s+/);
    const abbr = parts[0];
    const romanian = parts.slice(1).join(' ');
    return { abbr, romanian, crimean: crimean.trim() };
});

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('guide');

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
          <h2 id="guide-title" className="text-xl font-bold text-gray-800 dark:text-white">
            Dictionary Guide
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close guide modal"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        
        <nav className="border-b border-gray-200 dark:border-slate-700 flex">
          <button
            onClick={() => setActiveTab('guide')}
            role="tab"
            aria-selected={activeTab === 'guide'}
            className={`flex-1 p-3 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeTab === 'guide' ? 'bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Understanding Entries
          </button>
          <button
            onClick={() => setActiveTab('abbreviations')}
            role="tab"
            aria-selected={activeTab === 'abbreviations'}
            className={`flex-1 p-3 font-semibold text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${activeTab === 'abbreviations' ? 'bg-blue-50 dark:bg-slate-700/50 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
          >
            Abbreviations
          </button>
        </nav>

        <div className="p-6 overflow-y-auto">
          {activeTab === 'guide' && (
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <h4 className="flex items-center font-semibold text-base text-gray-800 dark:text-gray-200 mb-3">
                <QuestionMarkCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                How to Read Entries
              </h4>
              <ul className="list-disc list-inside space-y-2 pl-2 leading-relaxed">
                <li><strong>Roman numerals</strong> (e.g., I., II.) separate main grammatical categories.</li>
                <li><strong>Capital letters</strong> (e.g., A., B.) separate grammatical subcategories.</li>
                <li><strong>Arabic numerals</strong> (e.g., 1., 2.) list the different meanings of a word.</li>
                <li><strong>Semicolon (;)</strong> separates equivalent translations.</li>
                <li><strong>Hyphen (-)</strong> precedes suffixes in the Crimean Tatar language.</li>
                <li><strong>Parentheses ( )</strong> enclose optional suffixes that can be omitted without changing the word's meaning.</li>
                <li><strong>Single Slash (/)</strong> indicates that a term can be replaced by the one preceding it.</li>
                <li><strong>Median Dot (●)</strong> marks compound verbs, phrases, expressions, and examples.</li>
                <li><strong>Double Slash (//)</strong> separates groups of examples or phrases marked with a dot.</li>
              </ul>
            </div>
          )}

          {activeTab === 'abbreviations' && (
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-50 dark:bg-slate-700 text-xs text-gray-700 dark:text-gray-400 uppercase sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-2 font-semibold">Abbreviation</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Romanian</th>
                  <th scope="col" className="px-4 py-2 font-semibold">Crimean Tatar</th>
                </tr>
              </thead>
              <tbody>
                {parsedAbbreviations.map(({ abbr, romanian, crimean }, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600/20">
                    <td className="px-4 py-2 font-mono font-bold text-blue-600 dark:text-blue-400">{abbr}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{romanian}</td>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-200">{crimean}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuideModal;
