export interface Bookmark {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  archived: boolean;
  created_at: string;
  updated_at: string | null;
}