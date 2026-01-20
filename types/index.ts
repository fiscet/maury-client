export interface Profile {
  id: string;
  email: string;
  company_name: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Document {
  id: string;
  name: string;
  file_path: string;
  year: string;
  month: string;
  size: string;
  status: 'read' | 'unread';
  type: 'pdf' | 'image';
  created_at: string;
  user_id?: string;
  notesCount?: number; // Optional computed field
}

export interface Note {
  id: string;
  document_id: string;
  author_id: string;
  content: string;
  created_at: string;
}
