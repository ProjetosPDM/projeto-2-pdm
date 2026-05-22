import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from "@/utils/supabase";
import { authService } from '@/services/authService';
import { UserProfile } from '../types/User';
import { buscarPerfilOfflineDB, salvarPerfilOfflineDB, limparCacheSessaoDB } from '../utils/database';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const carregarPerfil = async (userId: string, userEmail: string) => {
    try {
      const { data } = await authService.getProfile(userId);
      if (data) {
        const profileWithEmail: UserProfile = {
        ...data,
        email: userEmail
      };
        setProfile(profileWithEmail);
        await salvarPerfilOfflineDB(profileWithEmail);
      }
    } catch (error) {
      const offlineProfile = await buscarPerfilOfflineDB();
      if (offlineProfile) {
        setProfile(offlineProfile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        carregarPerfil(session.user.id,session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        carregarPerfil(session.user.id, session.user.email!);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
    await limparCacheSessaoDB();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);