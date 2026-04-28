import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDlfPys0Lw8Iv2QBGql9XmQlBl9wRbuAO8',
  authDomain: 'projectmanagement-f9511.firebaseapp.com',
  projectId: 'projectmanagement-f9511',
  storageBucket: 'projectmanagement-f9511.firebasestorage.app',
  messagingSenderId: '142661303707',
  appId: '1:142661303707:web:a1cee3e42e57f63f7d753e',
  measurementId: 'G-W2NS2CMN1G',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
