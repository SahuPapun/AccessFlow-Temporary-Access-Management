'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User as FirebaseUser, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc, getDocs, query, limit, runTransaction } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import type { User, UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { auth, firestore } = useFirebase();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !firestore) {
      setLoading(false);
      return;
    }
  
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = { uid: firebaseUser.uid, ...userDoc.data() } as User;
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
            console.error("Error fetching user document:", error);
            setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  useEffect(() => {
    if (loading) return; 

    const isAuthPage = pathname === '/login';

    if (!user && !isAuthPage) {
        router.replace('/login');
    } else if (user && isAuthPage) {
        router.replace('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    if (!auth) return;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Login failed", error);
      let description = "Could not sign in. Please check your credentials.";
      if (error.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please try again.";
      } else if (error.message) {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: description,
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    if (!auth || !firestore) return;
    
    let userCredential;
    try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error("Auth creation failed during signup", error);
        let description = "An unexpected error occurred during sign up.";
        if (error.code === 'auth/email-already-in-use') {
            description = 'This email address is already in use by another account.';
        } else if (error.code === 'auth/weak-password') {
            description = 'The password is too weak. Please use at least 6 characters.';
        } else if (error.message) {
            description = error.message;
        }
        toast({
            variant: "destructive",
            title: "Sign up Failed",
            description,
        });
        throw error;
    }

    const firebaseUser = userCredential.user;

    try {
        await runTransaction(firestore, async (transaction) => {
            const usersRef = collection(firestore, 'users');
            const usersQuery = query(usersRef, limit(1));
            const usersSnapshot = await getDocs(usersQuery);
            const isFirstUser = usersSnapshot.empty;
            const role: UserRole = isFirstUser ? 'admin' : 'user';

            const userDocRef = doc(firestore, 'users', firebaseUser.uid);
            const newUser: Omit<User, 'uid'> = {
                email,
                firstName,
                lastName,
                role,
            };
            transaction.set(userDocRef, newUser);
            
            const auditLogRef = collection(firestore, 'audit_logs');
            transaction.set(doc(auditLogRef), {
                userId: firebaseUser.uid,
                action: 'user.created',
                timestamp: serverTimestamp(),
                details: { userEmail: email, createdUserId: firebaseUser.uid },
            });
        });
      
        toast({
            title: "Account Created",
            description: "Your account has been created successfully. You can now sign in."
        });

        await signOut(auth);

    } catch (error: any) {
      console.error("Firestore transaction failed during signup", error);
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: "Could not save user information. Please contact support.",
      });
      await firebaseUser.delete().catch(delErr => console.error("Failed to clean up auth user after failed signup", delErr));
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        setUser(null);
        router.replace('/login');
    } catch (error: any) {
        console.error("Logout failed", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: error.message,
        });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
