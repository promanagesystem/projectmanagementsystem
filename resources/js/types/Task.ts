import { User } from "./User";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  module_type: string;
  priority: "low" | "medium" | "high";
  progress_percentage: number;
  start_date?: string;
  end_date?: string;
  assigned_user?: User | null;
  created_by?: User | null;
  created_at?: string;
  updated_at?: string;
}
