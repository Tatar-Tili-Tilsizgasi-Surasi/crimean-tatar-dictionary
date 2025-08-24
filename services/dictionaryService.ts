import { DictionaryEntry } from '../types';

const rawDictionaryText = `
a interj. a!; ah!; ay!;
aba s. 1. soră mai mare. 2. mătuşă (după mamă). 3. mamă. 4. (text.) aba; dimie; pănură.
abadan adj. 1. înfloritor; prosper. 2. locuit; populat.
abadanlîk s. 1. centru populat; aşezare; localitate prosperă. 2. înflorire; prosperitate.
abağî s. abagiu.
abajur s. abajur.
abakay s. (ent.) tarantulă (lat., Lycosa tarentula).
abalamak v.i. a lătra.
abalaw s. lătrat.
abanoz s. (bot.) curmal-japonez; abanos; eben (lat., Dyospiros kaki).
abat I. adj. 1. înfloritor; prosper. 2. locuit; populat. II. s. centru populat; aşezare; localitate prosperă. // ●abat bolmak a se popula; a fi locuit; a înflori; a prospera; a se popula; a se construi; a se renova; a se moderniza. ●abat etmek a popula; a construi; a renova; a moderniza. // ●abat kasaba localitate prosperă.
abatlaşkan adj. locuit; populat; propăşit; prosper; înflorit; edificat; construit; modernizat; reclădit; recondiţionat; reconstruit; renovat; restaurat.
abatlaşmak v.i. 1. a se popula; a fi locuit. 2. a înflori; a prospera.
abatlaştîrîlgan adj. 1. populat; locuit. 2. construit; renovat; restaurat; modernizat.
abatlaştîrîlmak v.i. 1. a se popula. 2. a se construi; a se renova; a se restaura; a se moderniza.
abatlaştîrmak v.t. 1. a popula. 2. a construi; a renova; a restaura; a moderniza.
abatlaştîruw s. 1. populare. 2. construire; renovare; restaurare; modernizare.
abatlaştîruwğî s., adj. novator; renovator; restaurator; modernizator.
abatlîk s. 1. construcţie; clădire. 2. renovare; restaurare; modernizare. // ●abatlîk íşlerí şantier de construcţii.
abay s. (dim., fam.) mămică; mătuşică maternală; surioară mai mare. // ●abaym maraz mama e bolnavă.
abaylama s. 1. sesizare; observare. 2. percepţie; simţire.
abaylamak v.t. a observa; a sesiza; a simţi; a percepe; a băga de seamă.
abaylanaalgan adj. perceptibil.
abaylanaalmaz adj. imperceptibil.
abaylanatan adj. perceptibil.
abaylangan adj. observat; sesizat; simţit; perceput.
abaylanîr adj. perceptibil.
abaylanmadan adv. neobservat; pe neobservate; tiptil; fără a fi sesizat; fără a fi perceput. // ●abaylanmadan barmak a se furişa; a se strecura; a se fofila.
abaylanmadanbargan adj. strecurat; furişat.
abaylanmadanbaruw s. strecurare; furişare; fofilare.
abaylanmagan adj. neobservat; nesesizat; neperceput.
abaylanmak v.i. a fi perceput; a fi observat; a fi simţit.
abaylanmaykalîr adj. imperceptibil.
abaylanmaytan adj. imperceptibil.
abaylanmaz adj. imperceptibil.
abaylaw s. 1. sesizare; observare. 2. percepere; simţire.
abaylawğî s. (d. oameni) observator.
abaylîk s. maternitate; calitate de mamă.
abayşîk s. (dim., pop.) măicuţă; mătuşică; surioară.
abbas s. (zool.) leu (lat., Felis leo).
Abbas s. (antrop. m., arab.) "Leul".
abçes s. (med.) abces.
abdal s., adj. cretin; imbecil; dobitoc.
abdallaşkan adj. îndobitocit.
abdallaşma s. îndobitocire.
abdallaşmak v.i. a se îndobitoci.
abdallaşuw s. îndobitocire.
abdallîk s. cretinism; imbecilitate.
abdest s. (relig., la musulmani) spălare rituală a corpului pentru purificare; abluţiune. // ●abdest almak (relig., la musulmani) a face abluţiune. ●abdestín bermek a muştrului; a trage cuiva o papară. ●abdestín bîzmak a merge la toaletă; a-şi face nevoile.
abdestbergen adj. dojenitor; mustrător.
abdestberúw s. dojană; muştruluială; burduşeală; ciomăgeală; mustrare; chelfăneală.
abdestíberílgen adj. dojenit; muştruluit; burduşit; ciomăgit; mustrat.
abdestkana s. toaletă; closet.
Abdim'níñ-legelegí s. (orn.) barza lui Abdim (lat., Ciconia abdimii).
Abdiy s. (antrop. m., arab.) "Proslăvitorul"; "Adoratorul"; "Robul"; "Slujitorul"; "Supusul".
abdîragan adj. pripit.
abdîrama interj. uşurel!; încetişor!;
abdîramadan adv. încet; tacticos; lent; agale; alene.
abdîramak v.i. a se pripi.
abdîratmak v.t. a determina să se pripească.
abdîraw s. pripă.
Abdul s. (antrop. m., arab.) "Proslăvitorul (lui Allah)"; "Supusul (lui Allah)"; "Robul (lui Allah)".
Abduladil s. (antrop. m., arab.) “Supusul Celui drept”.
Abdulafuw s. (antrop. m., arab.) “Supusul Celui iertător”.
Abdulalim s. (antrop. m., arab.) “Supusul Celui atotştiutor”.
Abdulaliy s. (antrop. m., arab.) “Supusul Celui preaînalt”.
Abdulazim s. (antrop. m., arab.) “Supusul Celui grandios”.
Abdulaziz s. (antrop. m., arab.) “Supusul Celui preacinstit”.
Abdulbakiy s. (antrop. m., arab.) “Supusul Celui veşnic”.
Abdulbariy s. (antrop. m., arab.) “Supusul Făuritorului”.
Abdulbasir s. (antrop. m., arab.) “Supusul Atotvăzătorului”.
Abdulbasit s. (antrop. m., arab.) “Supusul Celui munific”.
Abdulbatin s. (antrop. m., arab.) “Supusul Celui misterios”.
Abdulbayis s. (antrop. m., arab.) “Supusul Celui ce reînsufleţeşte”.
Abdulbediy s. (antrop. m., arab.) “Supusul Ziditorului”.
Abdulberr s. (antrop. m., arab.) “Supusul Binefăcătorului”.
Abdulehat s. (antrop. m., arab.) “Supusul Celui unic”; “Supusul Celui indivizibil”.
Abdulevvel s. (antrop. m., arab.) “Supusul Celui ce este obârşia tuturor lucrurilor şi vieţuitoarelor”.
Abdulfettah s. (antrop. m., arab.) “Supusul Desferecătorului”.
Abdulgaffar s. (antrop. m., arab.) “Supusul Celui cruţător”.
Abdulgafur s. (antrop. m., arab.) “Supusul Celui îndurător”.
Abdulganiy s. (antrop. m., arab.) “Supusul Celui îmbelşugat”.
Abdulğebbar s. (antrop. m., arab.) “Supusul Celui măiestru”.
Abdulğelil s. (antrop. m., arab.) “Supusul Celui sublim”.
Abdulğewat s. (antrop. m., arab.) “Supusul Celui generos”.
Abdulhadiy s. (antrop. m., arab.) “Supusul Călăuzitorului”.
Abdulhafiz s. (antrop. m., arab.) “Supusul Depozitarului”.
Abdulhakem s. (antrop. m., arab.) “Supusul Judecătorului”.
Abdulhakim s. (antrop. m., arab.) “Supusul Celui preaînţelept”.
Abdulhakk s. (antrop. m., arab.) “Supusul Adevărului”.
Abdulhalik/Abdulkalik s. (antrop. m., arab.) “Supusul Întemeietorului”.
Abdulhalim s. (antrop. m., arab.) “Supusul Celui preabun”.
Abdulhamit s. (antrop. m., arab.) “Supusul Celui preaslăvit”.
Abdulhasip s. (antrop. m., arab.) “Supusul Socotitorului”.
Abdulhayiy s. (antrop. m., arab.) “Supusul Celui aievea viu”.
Abdulkabir s. (antrop. m., arab.) “Supusul Celui cunoscător”.
Abdulkadir s. (antrop. m., arab.) “Supusul Celui atotputernic”.
Abdulkahhar s. (antrop. m., arab.) “Supusul Celui covârşitor”.
Abdul-Kasîm s. (topon.) Abdulcasim (astăzi Casimcea, prin unirea cu Caracasim) (jud. Tulcea).
Abdulkawuy s. (antrop. m., arab.) “Supusul Celui preaputernic”.
Abdulkayyum s. (antrop. m., arab.) “Supusul Atotdiriguitorului”.
Abdulkebir s. (antrop. m., arab.) “Supusul Celui maiestuos”.
Abdulkerim s. (antrop. m., arab.) “Supusul Celui mărinimos”.
Abdulkuddus s. (antrop. m., arab.) “Supusul Celui sfânt şi neîntinat”.
Abdulla(h) s. (antrop. m., arab.) "Supusul lui Allah"; "Proslăvitorul lui Allah"; "Robul lui Allah" (unul din cele 400 de nume atribuite în Coran Profetului Muhammed Aliyselam)(nume purtat, de obicei, de noii convertiţi la religia islamică).
Abdullátif s. (antrop. m., arab.) “Supusul Celui subtil”.
Abdulmağit/Abdulmajit s. (antrop. m., arab.) “Supusul Celui nobil”.
Abdulmalik s. (antrop. m., arab.) “Supusul Atotstăpânitorului”.
`;

let dictionaryEntries: DictionaryEntry[] | null = null;

const parseDictionaryEntries = (text: string): DictionaryEntry[] => {
  const entries: DictionaryEntry[] = [];
  const lines = text.trim().split('\n');

  // This character set includes all necessary letters for Crimean Tatar and Romanian,
  // plus special characters found in some words like '()', '/', and apostrophes.
  const wordChars = `[a-zA-ZăĂâÂîÎşŞţŢáÁçÇğĞíÍñÑóÓúÚéÉ’'()/]`;

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    // Case 1: 'word - definition' (e.g., 'a - Abdulmalik')
    let match = line.match(`^(${wordChars}+(?:-${wordChars}+)*)\\s+-\\s+(.*)`);
    if (match) {
      entries.push({
        word: match[1],
        definition: match[2].trim().replace(/\s\s+/g, ' '),
      });
      continue;
    }

    // Case 2: 'word abbr. definition' (e.g., 'aba s. ...' or 'abat I. adj. ...')
    // Allows for uppercase abbreviations like 'I.'.
    match = line.match(`^(${wordChars}+(?:-${wordChars}+)*)\\s+((?:[a-zA-Z]+\\.,?\\s*)+)(.*)`);
    if (match) {
      entries.push({
        word: match[1],
        abbreviation: match[2].trim(),
        definition: match[3].trim().replace(/\s\s+/g, ' '),
      });
      continue;
    }
    
    // Lines that don't match either pattern are ignored, treating each valid line as a new entry.
  }

  return entries;
};


const getDictionaryEntries = (): Promise<DictionaryEntry[]> => {
  return new Promise((resolve) => {
    if (dictionaryEntries) {
      resolve(dictionaryEntries);
    } else {
      dictionaryEntries = parseDictionaryEntries(rawDictionaryText);
      resolve(dictionaryEntries);
    }
  });
};

export const searchDictionary = async (term: string): Promise<DictionaryEntry[]> => {
  const entries = await getDictionaryEntries();
  if (!term.trim()) {
    return [];
  }

  const lowerCaseTerm = term.toLowerCase();
  return entries.filter(entry => 
    entry.word.toLowerCase().startsWith(lowerCaseTerm) || 
    entry.definition.toLowerCase().includes(lowerCaseTerm)
  );
};

export const getEntriesByLetter = async (letter: string): Promise<DictionaryEntry[]> => {
    const entries = await getDictionaryEntries();
    if (!letter || letter.length !== 1) {
        return [];
    }
    const lowerCaseLetter = letter.toLowerCase();
    // A special collation for Crimean Tatar might be needed for perfect sorting,
    // but for filtering, this is sufficient.
    return entries.filter(entry => entry.word.toLowerCase().startsWith(lowerCaseLetter));
};