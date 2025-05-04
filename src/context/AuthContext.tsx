'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(isSupabaseConfigured());

  useEffect(() => {
    // If Supabase is not configured, don't try to authenticate
    if (!configured) {
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error('Error getting user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        data.subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state change:', error);
      setLoading(false);
      return () => {};
    }
  }, [configured]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error.message);
        throw error;
      }

      console.log('Sign in successful:', data);

      // Force a page refresh to ensure the auth state is updated
      window.location.href = '/dashboard';

      return data;
    } catch (error) {
      console.error('Sign in exception:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error.message);
        throw error;
      }

      console.log('Sign out successful');

      // Clear any local storage items
      localStorage.removeItem('selectedUser');

      // Force redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Sign out exception:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, configured, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
