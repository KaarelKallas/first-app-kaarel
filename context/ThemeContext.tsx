import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme } from '../types/theme';

// Kirjeldab, mida iga ekraan Context'i kaudu kätte saab: hetke teemaobjekt,
// kas tume teema on aktiivne (mugav otseväärtus, ei pea theme'i endast tuletama),
// ja funktsioon, millega kasutaja teemat vahetada saab.
interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// createContext<...>(undefined) — algväärtus on undefined, mitte päris Theme,
// sest keegi ei tohiks Context'i väärtust kasutada väljaspool <ThemeProvider>-it.
// See "undefined" on hiljem useTheme()-i sees kontrolli aluseks (vt allpool).
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// '@'-prefiksiga võti on AsyncStorage'i enda soovituslik tava — aitab vältida
// kokkupõrkeid teiste võimalike salvestatud võtmetega samas äpis.
const THEME_STORAGE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: ReactNode }) {
  // useColorScheme() loeb telefoni SÜSTEEMI hetketeemat (Seaded-rakendusest),
  // mitte midagi, mida kasutaja SELLES äpis valinud on.
  const systemColorScheme = useColorScheme();

  // Algväärtusena kasutame süsteemi teemat — enne kui salvestatud eelistus
  // (kui see on olemas) jõuab alt tulla, näidatakse kasutajale mõistlikku vaikeväärtust,
  // mitte alati heledat teemat.
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  // Loeme salvestatud eelistuse rakenduse käivitumisel.
  // Tühi massiiv [] teise argumendina tähendab: see useEffect käivitub
  // ainult ÜKS KORD, kui ThemeProvider esmakordselt renderdatakse — mitte iga
  // renderduse peale.
  useEffect(() => {
    // AsyncStorage.getItem on asünkroonne ja tagastab Promise'i, mis lahendub
    // kas salvestatud stringiga või `null`-iga (kui midagi pole veel salvestatud).
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      // Kontrollime `saved !== null`, et MITTE üle kirjutada äsja pandud
      // süsteemi-põhist algväärtust juhul, kui kasutaja pole veel kunagi ise valinud —
      // "null" tähendab "kasutaja pole kunagi valinud", mitte "kasutaja valis heleda".
      if (saved !== null) {
        setIsDarkMode(saved === 'dark');
      }
    });
  }, []);

  const toggleDarkMode = () => {
    const uus = !isDarkMode;
    setIsDarkMode(uus); // uuendab kohe ekraani (React state)
    AsyncStorage.setItem(THEME_STORAGE_KEY, uus ? 'dark' : 'light'); // salvestab, et järgmine käivitus mäletaks
  };

  // Tuletatud väärtus — ei ole omaette state'is, vaid arvutatakse iga
  // renderduse käigus `isDarkMode`-i põhjal uuesti. Nii ei saa `theme` ja
  // `isDarkMode` kunagi omavahel lahku minna.
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Kõik { theme, isDarkMode, toggleDarkMode } saavad kätte kõik
  // Provider'i sees olevad komponendid, ükskõik kui sügaval nad ka poleks.
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook, mida ekraanid päriselt kasutavad (mitte otse useContext(ThemeContext)-i).
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  // Kui context on undefined, tähendab see, et komponent, mis useTheme()-i kutsub,
  // ei ole <ThemeProvider> sees — ilma selle kontrollita saaks vea alles siis,
  // kui keegi hiljem proovib kirjutada nt `theme.colors.text` ja tabab
  // segase "Cannot read properties of undefined" krahhi. Nii saab kohe selge,
  // arusaadava veateate juba arenduse ajal.
  if (context === undefined) {
    throw new Error('useTheme tuleb kasutada ThemeProvider seest');
  }
  return context;
}
