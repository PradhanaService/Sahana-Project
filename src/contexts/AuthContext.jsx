import { createContext, useEffect, useMemo, useState } from 'react';
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);
const LAST_AUTH_UID_KEY = 'sprintforge:last-auth-uid';

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } finally {
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          const expectedUid = window.localStorage.getItem(LAST_AUTH_UID_KEY);

          if (user && expectedUid && user.uid !== expectedUid) {
            await signOut(auth);
            setCurrentUser(null);
            setAuthLoading(false);
            return;
          }

          if (user && !expectedUid) {
            window.localStorage.setItem(LAST_AUTH_UID_KEY, user.uid);
          }

          setCurrentUser(user);
          setAuthLoading(false);
        });
      }
    };

    initializeAuth();

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      authLoading,
      signup: async ({ name, email, password, role, team, division, companyName }) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        window.localStorage.setItem(LAST_AUTH_UID_KEY, credential.user.uid);
        await setDoc(doc(db, 'users', credential.user.uid), {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          team: division || team,
          division: division || team,
          companyName: companyName?.trim() || 'Sprintforge',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        return credential.user;
      },
      login: async (email, password) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        window.localStorage.setItem(LAST_AUTH_UID_KEY, credential.user.uid);
        return credential;
      },
      logout: async () => {
        window.localStorage.removeItem(LAST_AUTH_UID_KEY);
        await signOut(auth);
      },
    }),
    [authLoading, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
