export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  matricula: string;
  role: UserRole;
  is_approved: boolean;
  updated_at?: string;
}