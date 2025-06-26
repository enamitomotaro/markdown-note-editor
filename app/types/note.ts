export type Note = {
  id: string;        // UUID
  title: string;     // 先頭の H1（なければ代替）
  body: string;      // Markdown ソース
  updatedAt: number; // エポック ms
};