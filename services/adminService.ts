import { supabase } from '@/utils/supabase';
import { UserProfile } from '../types/User';

export const adminService = {
  async getPendingUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_approved', false)
      .order('full_name', { ascending: true });
    
    return { data: data as UserProfile[], error };
  },

  async approveUser(userId: string) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', userId);
    
    return { error };
  },

  async getDisciplinas() {
    const { data, error } = await supabase
      .from('disciplinas')
      .select(`
        *,
        horarios_disciplina (*)
      `)
      .order('nome', { ascending: true });
    
    return { data, error };
  },

  async createSubject(
    disciplina: { nome: string; professor: string; local: string },
    horarios: { dia_semana: string; hora_inicio: string; hora_fim: string }[]
  ) {
    const { data: subjectData, error: subjectError } = await supabase
      .from('disciplinas')
      .insert([disciplina])
      .select()
      .single();

    if (subjectError) return { error: subjectError };

    const horariosComId = horarios.map(h => ({
      ...h,
      disciplina_id: subjectData.id
    }));

    const { error: scheduleError } = await supabase
      .from('horarios_disciplina')
      .insert(horariosComId);

    return { data: subjectData, error: scheduleError };
  },

  async updateSubject(
    id: string,
    disciplina: { nome: string; professor: string; local: string },
    horarios: { dia_semana: string; hora_inicio: string; hora_fim: string }[]
  ) {
    const { error: updateError } = await supabase
      .from('disciplinas')
      .update(disciplina)
      .eq('id', id);

    if (updateError) return { error: updateError };

    await supabase.from('horarios_disciplina').delete().eq('disciplina_id', id);

    const horariosComId = horarios.map(h => ({
      ...h,
      disciplina_id: id
    }));

    const { error: scheduleError } = await supabase
      .from('horarios_disciplina')
      .insert(horariosComId);

    return { error: scheduleError };
  },

  async deleteSubject(id: string) {
    const { error } = await supabase
      .from('disciplinas')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};