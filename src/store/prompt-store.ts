import type { Prompt } from "@/types";
import { create } from "zustand";

interface PromptState {
  prompts: Prompt[];
  filterType: "title" | "prompt" | "category";
  searchQuery: string;
  setFilterType: (type: "title" | "prompt" | "category") => void;
  setSearchQuery: (query: string) => void;
  addPrompt: (prompt: Omit<Prompt, "id" | "usageCount" | "createdAt">) => void;
  updatePrompt: (id: string, prompt: Partial<Prompt>) => void;
  incrementUsage: (id: string) => void;
  getFilteredPrompts: () => Prompt[];
}

export const usePromptStore = create<PromptState>((set, get) => ({
  prompts: [],
  filterType: "title",
  searchQuery: "",

  setFilterType: (type) => set({ filterType: type }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addPrompt: (prompt) => {
    const newPrompt: Prompt = {
      ...prompt,
      id: crypto.randomUUID(),
      usageCount: 0,
      createdAt: Date.now(),
    };
    set((state) => ({ prompts: [...state.prompts, newPrompt] }));
  },

  updatePrompt: (id, updatedPrompt) => {
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === id ? { ...p, ...updatedPrompt } : p
      ),
    }));
  },

  incrementUsage: (id) => {
    set((state) => ({
      prompts: state.prompts.map((p) =>
        p.id === id ? { ...p, usageCount: p.usageCount + 1 } : p
      ),
    }));
  },

  getFilteredPrompts: () => {
    const { prompts, filterType, searchQuery } = get();
    const query = searchQuery.toLowerCase();

    return prompts
      .filter((prompt) => {
        if (!query) return true;
        switch (filterType) {
          case "title":
            return prompt.title.toLowerCase().includes(query);
          case "prompt":
            return prompt.content.toLowerCase().includes(query);
          case "category":
            return prompt.category.toLowerCase().includes(query);
          default:
            return true;
        }
      })
      .sort((a, b) => b.usageCount - a.usageCount);
  },
}));
