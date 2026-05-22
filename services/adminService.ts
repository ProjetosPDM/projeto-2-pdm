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
  }
};