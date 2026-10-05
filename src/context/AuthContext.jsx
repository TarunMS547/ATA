import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Check if we are using the demo config
const isDemoMode = import.meta.env.VITE_FIREBASE_API_KEY === undefined;

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password, name) {
    if (isDemoMode) {
      const mockUser = { uid: 'demo-123', email, displayName: name, role: 'admin' };
      setCurrentUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      return { user: mockUser };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName: name });
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name,
      email,
      role: 'user',
      createdAt: new Date().toISOString()
    });
    
    return userCredential;
  }

  async function login(email, password) {
    if (isDemoMode) {
      if (email === 'admin@demo.com' && password === 'admin123') {
        const mockUser = { uid: 'demo-123', email, displayName: 'Demo Admin', role: 'admin' };
        setCurrentUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
        return { user: mockUser };
      }
      throw new Error("Invalid credentials. Try admin@demo.com / admin123");
    }

    return signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    if (isDemoMode) {
      setCurrentUser(null);
      localStorage.removeItem('mockUser');
      return;
    }
    return signOut(auth);
  }

  function resetPassword(email) {
    if (isDemoMode) return Promise.resolve();
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    if (isDemoMode) {
      const savedUser = localStorage.getItem('mockUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setCurrentUser({ ...user, ...userDoc.data() });
          } else {
            setCurrentUser(user);
          }
        } catch (e) {
          console.warn("Could not fetch user document, continuing with basic auth data");
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
