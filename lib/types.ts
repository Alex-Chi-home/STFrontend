export enum ChatType {
  Private = "private",
  Group = "group",
}

export interface Chat {
  chat_type: string;
  created_at: string;
  id: number;
  name: string | null;
  updated_at: string;
  created_by: User;
  members: User[];
}
export interface User {
  id: number | null;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface Message {
  chat_id?: number;
  content: string;
  edited_at?: string;
  id: number | null;
  is_deleted?: boolean;
  sender?: User;
  sender_id?: number;
  sent_at?: string;
}
