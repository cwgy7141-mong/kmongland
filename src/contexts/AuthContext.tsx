// ============================================================
// AuthContext — Firebase Authentication React Context
// ============================================================
// 사용자 인증 상태를 앱 전체에서 관리하는 Context Provider
//
// 사용법:
// 1. main.tsx에서 <AuthProvider>로 앱을 감싸기
// 2. 컴포넌트에서 useAuth() 훅으로 사용자 정보 접근
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  type User,
} from 'firebase/auth';
import { auth, isFirebasePlaceholder } from '../lib/firebase';
import { createUserProfile, getUserProfile, type UserProfile } from '../lib/firestore';
import { Timestamp } from 'firebase/firestore';

// ── Context type ──

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;

  // Auth methods
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider component ──

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    if (isFirebasePlaceholder) {
      const cachedMockUser = localStorage.getItem('mock_user');
      if (cachedMockUser) {
        try {
          const parsed = JSON.parse(cachedMockUser);
          setUser(parsed);
          setProfile({
            uid: parsed.uid,
            email: parsed.email || '',
            displayName: parsed.displayName || 'K-Pop Fan',
            photoURL: parsed.photoURL || '',
            role: 'user',
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        } catch (e) {
          console.error('Failed to parse mock user:', e);
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          let userProfile = await getUserProfile(firebaseUser.uid);
          if (!userProfile) {
            await createUserProfile(firebaseUser.uid, {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
            userProfile = await getUserProfile(firebaseUser.uid);
          }
          setProfile(userProfile);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Sign-in methods ──

  const signInWithGoogle = async () => {
    if (isFirebasePlaceholder) {
      setError(null);
      const inputName = prompt('Enter your name for Google Login:', 'Learner') || 'Learner';
      const inputEmail = prompt('Enter your email:', `${inputName.toLowerCase().replace(/\s+/g, '')}@example.com`) || 'learner@example.com';
      const mockUser = {
        uid: 'mock_google_' + Date.now(),
        email: inputEmail,
        displayName: inputName,
        photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      } as User;
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email || '',
        displayName: mockUser.displayName || 'K-Pop Fan',
        photoURL: mockUser.photoURL || '',
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return;
    }

    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Google 로그인 실패');
      throw err;
    }
  };

  const signInWithApple = async () => {
    if (isFirebasePlaceholder) {
      setError(null);
      const inputName = prompt('Enter your name for Apple Login:', 'User') || 'User';
      const inputEmail = prompt('Enter your email:', `${inputName.toLowerCase().replace(/\s+/g, '')}@example.com`) || 'user@example.com';
      const mockUser = {
        uid: 'mock_apple_' + Date.now(),
        email: inputEmail,
        displayName: inputName,
        photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
      } as User;
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email || '',
        displayName: mockUser.displayName || 'K-Pop Fan',
        photoURL: mockUser.photoURL || '',
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return;
    }

    try {
      setError(null);
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Apple 로그인 실패');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (isFirebasePlaceholder) {
      setError(null);
      const mockUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
      const existingUser = mockUsers.find((u: any) => u.email === email);
      if (!existingUser || existingUser.password !== password) {
        const err = new Error('Invalid email or password (Mock Mode)');
        setError(err.message);
        throw err;
      }
      const mockUser = {
        uid: existingUser.uid,
        email: existingUser.email,
        displayName: email.split('@')[0],
      } as User;
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email || '',
        displayName: mockUser.displayName || 'K-Pop Fan',
        photoURL: '',
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return;
    }

    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || '이메일 로그인 실패');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (isFirebasePlaceholder) {
      setError(null);
      const mockUsers = JSON.parse(localStorage.getItem('mock_registered_users') || '[]');
      if (mockUsers.some((u: any) => u.email === email)) {
        const err = new Error('Email already in use (Mock Mode)');
        setError(err.message);
        throw err;
      }
      const newUser = {
        uid: `mock_${Date.now()}`,
        email,
        password,
      };
      mockUsers.push(newUser);
      localStorage.setItem('mock_registered_users', JSON.stringify(mockUsers));
      
      const mockUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: email.split('@')[0],
      } as User;
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email || '',
        displayName: mockUser.displayName || 'K-Pop Fan',
        photoURL: '',
        role: 'user',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return;
    }

    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message || '회원가입 실패');
      throw err;
    }
  };

  const signOut = async () => {
    if (isFirebasePlaceholder) {
      localStorage.removeItem('mock_user');
      setUser(null);
      setProfile(null);
      return;
    }

    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message || '로그아웃 실패');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        signInWithGoogle,
        signInWithApple,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
