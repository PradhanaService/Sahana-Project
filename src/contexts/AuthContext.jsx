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

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } finally {
        unsubscribe = onAuthStateChanged(auth, (user) => {
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
      login: (email, password) => signInWithEmailAndPassword(auth, email, password),
      logout: () => signOut(auth),
    }),
    [authLoading, currentUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
