export type TaskFormData = {
    title: string;
    description?: string;
    project_id: number;
    sprint_id?: number | null;
    assigned_to?: number | null;
    module_type?:
        | 'backend'
        | 'frontend'
        | 'uiux'
        | 'project_manager'
        | 'marketing'
        | 'fullstack'
        | 'finance'
        | 'ai_engineer'
        | 'data_scientist';
    priority?: 'low' | 'medium' | 'high' | 'critical';
    status: 'todo' | 'in_progress' | 'review' | 'done';
    progress_percentage?: number;
    start_date?: string | null;
    end_date?: string | null;
};
