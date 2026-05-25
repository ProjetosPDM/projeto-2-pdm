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
  refreshProfile: () => Promise<void>;
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

  const refreshProfile = async () => {
    if (!session?.user.id) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!error && data) {
      const profileWithEmail: UserProfile = {
        ...data,
        email: session.user.email!
      };
      setProfile(profileWithEmail); 
    }
  };
 
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        console.error("Erro de Sessão (Token Inválido):", error.message);
        await limparCacheSessaoDB();
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
        return;
      }

      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        carregarPerfil(session.user.id, session.user.email!);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_OUT') {
        await limparCacheSessaoDB();
        setProfile(null);
      }

      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user && event !== 'SIGNED_OUT') {
        carregarPerfil(session.user.id, session.user.email!);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await authService.signOut();
    await limparCacheSessaoDB();
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);