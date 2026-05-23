// services/authService.ts
import { supabase } from "@/utils/supabase";
import { UserProfile } from '@/types/User';

export const authService = {
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, nome: string, matricula: string) {
    // 1. Enviamos o nome também para o Auth Metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nome,
          matricula: matricula,
        }
      }
    });

    if (error) return { data: null, error };

    if (data.user) {
      // 2. Tentamos salvar/atualizar o perfil
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: nome, // Certifique-se que o banco espera 'full_name'
        matricula: matricula,
         email: email,
        role: 'student',
        is_approved: false
      });
      
      if (profileError) {
        console.error("Erro detalhado no Perfil:", profileError); // <--- LOG PARA DEBUG
        return { data, error: profileError };
      }
    }

    return { data, error: null };
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async getProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }
};