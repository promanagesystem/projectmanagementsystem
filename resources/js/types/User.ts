export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string; // "project_manager", "developer", "uiux", etc.
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // fleksibel untuk tambahan properti lain
}
