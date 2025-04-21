import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  // your firebase config here
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return { user };
}