import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export function useAuth() { return useContext(AuthContext); }

// ─── LocalStorage helpers ─────────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem('lh_users') || '[]'); } catch { return []; }
}
function saveUsers(u) { localStorage.setItem('lh_users', JSON.stringify(u)); }
function getSession() {
  try { return JSON.parse(localStorage.getItem('lh_session') || 'null'); } catch { return null; }
}

// ─── Try to init Firebase (only if config looks valid) ───────────────────────
let firebaseAuth = null;
let googleProvider = null;
let signInWithPopup = null;
let firebaseReady = false;

async function tryInitFirebase() {
  try {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || '';
    // A valid Firebase web API key starts with AIzaSy and is ~39 chars
    if (!apiKey || !apiKey.startsWith('AIzaSy') || apiKey.length < 30) {
      console.warn('⚠️  Firebase API key missing or too short — using local auth.');
      return false;
    }
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth, GoogleAuthProvider, signInWithPopup: swp, onAuthStateChanged,
            createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile }
      = await import('firebase/auth');

    const config = {
      apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId:             import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = getApps().length ? getApps()[0] : initializeApp(config);
    firebaseAuth     = getAuth(app);
    googleProvider   = new GoogleAuthProvider();
    signInWithPopup  = swp;
    firebaseReady    = true;

    // Store firebase functions for use in auth context
    window.__lhFirebase = {
      auth: firebaseAuth,
      googleProvider,
      signInWithPopup: swp,
      onAuthStateChanged,
      createUserWithEmailAndPassword,
      signInWithEmailAndPassword,
      signOut,
      updateProfile,
    };
    console.log('✅ Firebase ready');
    return true;
  } catch (e) {
    console.warn('Firebase init failed:', e.message);
    return false;
  }
}

// ─── Auth Provider ────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getSession);
  const [loading, setLoading]         = useState(true);
  const [usingFirebase, setUsingFirebase] = useState(false);

  useEffect(() => {
    tryInitFirebase().then(ready => {
      setUsingFirebase(ready);
      if (ready && window.__lhFirebase) {
        const { onAuthStateChanged, auth } = window.__lhFirebase;
        const unsub = onAuthStateChanged(auth, user => {
          if (user) {
            const u = { uid: user.uid, email: user.email, displayName: user.displayName, photoURL: user.photoURL };
            setCurrentUser(u);
            localStorage.setItem('lh_session', JSON.stringify(u));
          } else {
            setCurrentUser(null);
            localStorage.removeItem('lh_session');
          }
          setLoading(false);
        });
        return unsub;
      } else {
        setLoading(false);
      }
    });
  }, []);

  // ── Signup ─────────────────────────────────────────────────────────────────
  async function signup(email, password) {
    if (usingFirebase && window.__lhFirebase) {
      const { createUserWithEmailAndPassword, updateProfile, auth } = window.__lhFirebase;
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: email.split('@')[0] });
      return result;
    }
    // Local fallback
    return new Promise((resolve, reject) => {
      const users = getUsers();
      if (users.find(u => u.email === email)) {
        reject(new Error('Email already in use. Please log in instead.')); return;
      }
      const newUser = { uid: `uid_${Date.now()}`, email, displayName: email.split('@')[0], createdAt: new Date().toISOString() };
      users.push({ ...newUser, password });
      saveUsers(users);
      localStorage.setItem('lh_session', JSON.stringify(newUser));
      setCurrentUser(newUser);
      resolve({ user: newUser });
    });
  }

  // ── Login ──────────────────────────────────────────────────────────────────
  async function login(email, password) {
    if (usingFirebase && window.__lhFirebase) {
      const { signInWithEmailAndPassword, auth } = window.__lhFirebase;
      return signInWithEmailAndPassword(auth, email, password);
    }
    return new Promise((resolve, reject) => {
      const users = getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { reject(new Error('Invalid email or password.')); return; }
      const { password: _p, ...safe } = user;
      localStorage.setItem('lh_session', JSON.stringify(safe));
      setCurrentUser(safe);
      resolve({ user: safe });
    });
  }

  // ── Google Login ───────────────────────────────────────────────────────────
  async function loginWithGoogle() {
    if (usingFirebase && window.__lhFirebase) {
      const { signInWithPopup, auth, googleProvider } = window.__lhFirebase;
      try {
        return await signInWithPopup(auth, googleProvider);
      } catch (err) {
        if (err.code === 'auth/popup-closed-by-user') throw new Error('Popup closed. Please try again.');
        if (err.code === 'auth/popup-blocked') throw new Error('Popup blocked! Please allow popups for this site.');
        throw err;
      }
    }
    throw new Error('Google Sign-In requires Firebase. Please add your Firebase API key to .env and restart.');
  }

  // ── Logout ─────────────────────────────────────────────────────────────────
  async function logout() {
    if (usingFirebase && window.__lhFirebase) {
      await window.__lhFirebase.signOut(window.__lhFirebase.auth);
    }
    localStorage.removeItem('lh_session');
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, loginWithGoogle, loading, usingFirebase }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
