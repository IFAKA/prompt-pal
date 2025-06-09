export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  usageCount: number;
  createdAt: number;
}

export type FilterType = "title" | "prompt" | "category";
