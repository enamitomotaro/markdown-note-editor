export interface Note {
  id: string;        // UUID
  title: string;     // 先頭の H1（なければ代替）
  body: string;      // Markdown ソース
  updatedAt: number; // エポック ms
}

export interface NoteInput {
  title?: string;
  body: string;
}

export interface NoteFilter {
  searchQuery?: string;
  sortBy?: 'updatedAt' | 'title' | 'created';
  sortOrder?: 'asc' | 'desc';
}

export interface NoteStats {
  totalCount: number;
  totalCharacters: number;
  averageLength: number;
}