import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  User, // Firebase'i enda kasutaja-tüüp (uid, email, jne) — mitte meie oma kirjeldatud tüüp
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged, // Firebase'i "kuula sisselogimisoleku muutust" funktsioon
} from 'firebase/auth';
import { auth } from '../config/firebase'; // config/firebase.ts-is loodud auth-instants

// user: null tähendab "keegi pole sisse logitud", User tähendab "see kasutaja on sisse logitud".
// loading: kas Firebase on veel esimest korda kontrollimas, kas keegi on juba sisse logitud
// (vt allpool useEffect) — kuni see on true, ei tea me veel, kumba ekraani näidata.
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Sama muster mis ThemeContext'is: algväärtus on undefined, mitte päris andmed —
// see annab useAuth()-i sees hiljem võimaluse kontrollida, kas Provider on üldse olemas.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // loading algab true-na, sest rakenduse käivitudes ei tea me VEEL, kas
  // kasutaja on juba varem sisse loginud (Firebase kontrollib seda taustal) —
  // false muutub see alles siis, kui allolev onAuthStateChanged esimest korda käivitub.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged on Firebase'i enda "kuulaja" (subscription), mitte üks-kordne päring:
    // 1) käivitub KOHE, kui komponent laetakse (annab teada, kas kasutaja on juba sisse logitud
    //    varasemast seansist — sellepärast peabki loading algselt true olema)
    // 2) käivitub uuesti iga kord, kui keegi sisse logib, välja logib või registreerub
    // firebaseUser on kas User-objekt (sisse logitud) või null (pole sisse logitud).
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false); // esimene vastus on kohal — enam pole vaja laadimisekraani näidata
    });
    // Puhastusfunktsioon: kui AuthProvider kunagi eemaldatakse puust, lõpetab
    // see kuulamise, et vältida "memory leak"-i ja hilinenud state-uuendusi.
    return unsubscribe;
  }, []); // [] — see efekt seadistatakse ainult üks kord, mitte iga renderduse peale

  const value: AuthContextType = {
    user,
    loading,
    // Iga funktsioon lihtsalt kutsub Firebase'i vastava meetodi — kui see õnnestub,
    // käivitub üleval oleva useEffect'i onAuthStateChanged kuulaja iseenesest ja
    // uuendab "user" oleku. Eraldi setUser() väljakutset siin vaja ei ole.
    // `.then()` ilma argumendita muudab Firebase'i tagastatud Promise<UserCredential>
    // tüübi Promise<void>-ks (väärtus visatakse minema) — täpselt see, mida
    // AuthContextType ülal signIn/signUp-i tüübiks nõuab.
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password).then(),
    signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password).then(),
    logout: () => signOut(auth),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — sama põhjus mis useTheme()-il: annab kätte konteksti VÄÄRTUSE
// (mitte Context'i enda), ja annab selge veateate, kui keegi kasutab seda
// väljaspool <AuthProvider>-it.
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth tuleb kasutada AuthProvider seest');
  }
  return context;
}
