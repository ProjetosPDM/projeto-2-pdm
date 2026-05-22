export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  full_name: string;
  matricula: string;
  role: UserRole;
  is_approved: boolean;
  email: string;
  updated_at?: string;
}