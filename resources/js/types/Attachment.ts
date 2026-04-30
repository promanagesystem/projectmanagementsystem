import { User } from "./User";

export interface Attachment {
  id: number;
  file_name: string;
  file_path?: string;
  file_type?: string;
  link?: string | null;
  uploaded_by?: User | null;
  created_at?: string;
}
