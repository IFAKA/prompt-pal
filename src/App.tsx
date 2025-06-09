import { AnimatePresence, motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { PromptCard } from "./components/prompt/PromptCard";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Textarea } from "./components/ui/textarea";
import type { Prompt } from "./types";

const categories = [
  "General",
  "Creative",
  "Technical",
  "Productivity",
  "Fun",
] as const;
type Category = (typeof categories)[number];

const App = () => {
  const [page, setPage] = useState<"home" | "add" | "edit">("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState<"title" | "prompt" | "category">(
    "title"
  );
  const [title, setTitle] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [category, setCategory] = useState<Category>(categories[0]);
  const [deletePrompt, setDeletePrompt] = useState<Prompt | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["prompts"], (result) => {
      setPrompts(result.prompts || []);
      setHasAnimated(true);
    });
  }, []);

  const savePrompts = (newPrompts: Prompt[]) => {
    setPrompts(newPrompts);
    chrome.storage.local.set({ prompts: newPrompts });
  };

  const handleAddPrompt = () => {
    if (title.trim() && promptContent.trim()) {
      const newPrompt: Prompt = {
        id: crypto.randomUUID(),
        title,
        content: promptContent,
        category,
        usageCount: 0,
        createdAt: Date.now(),
      };
      savePrompts([...prompts, newPrompt]);
      setPage("home");
      setTitle("");
      setPromptContent("");
      setCategory(categories[0]);
    }
  };

  const handleEditPrompt = () => {
    if (editingPrompt && title.trim() && promptContent.trim()) {
      const updatedPrompts = prompts.map((p: Prompt) =>
        p.id === editingPrompt.id
          ? { ...p, title, content: promptContent, category }
          : p
      );
      savePrompts(updatedPrompts);
      setPage("home");
      setEditingPrompt(undefined);
      setTitle("");
      setPromptContent("");
      setCategory(categories[0]);
    }
  };

  const handleDeletePrompt = () => {
    if (deletePrompt) {
      const updatedPrompts = prompts.filter(
        (p: Prompt) => p.id !== deletePrompt.id
      );
      savePrompts(updatedPrompts);
      setDeletePrompt(null);
    }
  };

  const filteredPrompts = prompts.filter((p: Prompt) =>
    filterBy === "title"
      ? p.title.toLowerCase().includes(searchTerm.toLowerCase())
      : filterBy === "prompt"
      ? p.content.toLowerCase().includes(searchTerm.toLowerCase())
      : p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedPrompts = filteredPrompts.reduce(
    (acc: Record<string, Prompt[]>, prompt: Prompt) => {
      acc[prompt.category] = acc[prompt.category] || [];
      acc[prompt.category].push(prompt);
      return acc;
    },
    {}
  );

  const sortedCategories = Object.keys(groupedPrompts).sort((a, b) => {
    const usageA = groupedPrompts[a].reduce(
      (sum: number, p: Prompt) => sum + p.usageCount,
      0
    );
    const usageB = groupedPrompts[b].reduce(
      (sum: number, p: Prompt) => sum + p.usageCount,
      0
    );
    return usageB - usageA;
  });

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-[360px] h-[583px] p-4 overflow-y-auto bg-background text-foreground">
      {/* 360:583 follows the golden ratio */}
      <AnimatePresence mode="wait">
        {page === "home" && (
          <motion.div
            key="home"
            initial={hasAnimated ? false : "hidden"}
            animate="show"
            exit="hidden"
            variants={containerAnimation}
            className="space-y-4"
          >
            <motion.h1
              variants={itemAnimation}
              className="text-2xl font-extrabold text-center flex items-center justify-center"
            >
              <Rocket className="mr-2 h-6 w-6" /> PromptPal
              <Sparkles className="ml-2 h-6 w-6" />
            </motion.h1>

            <motion.div
              variants={itemAnimation}
              className="flex gap-2 items-center"
            >
              <Input
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select
                value={filterBy}
                onValueChange={(value) =>
                  setFilterBy(value as "title" | "prompt" | "category")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="prompt">Prompt</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <Button onClick={() => setPage("add")} className="w-full">
              Add New Prompt
            </Button>

            <motion.div variants={containerAnimation} className="space-y-4">
              {sortedCategories.map((category) => (
                <motion.div
                  key={category}
                  variants={itemAnimation}
                  initial={hasAnimated ? false : "hidden"}
                  animate="show"
                >
                  <h2 className="text-xl font-bold mb-2">{category}</h2>
                  <div className="space-y-2">
                    <AnimatePresence>
                      {groupedPrompts[category]
                        .sort(
                          (a: Prompt, b: Prompt) => b.usageCount - a.usageCount
                        )
                        .map((prompt: Prompt) => (
                          <PromptCard
                            prompt={prompt}
                            onEdit={(prompt) => {
                              setEditingPrompt(prompt);
                              setTitle(prompt.title);
                              setPromptContent(prompt.content);
                              setCategory(prompt.category as Category);
                              setPage("edit");
                            }}
                            onDelete={(prompt) => setDeletePrompt(prompt)}
                          />
                        ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {(page === "add" || page === "edit") && (
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-4"
          >
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-extrabold text-center flex items-center justify-center"
            >
              {page === "add" ? "New Prompt" : "Edit Prompt"}
              <Sparkles className="ml-2 h-6 w-6" />
            </motion.h1>

            <div className="space-y-4">
              <div>
                <Label className="font-bold mb-2 block">Category</Label>
                <Select
                  value={category}
                  onValueChange={(value: Category) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-bold mb-2 block">Title</Label>
                <Input
                  placeholder="Prompt Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Label className="font-bold mb-2 block">Prompt</Label>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  className="h-36 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={page === "add" ? handleAddPrompt : handleEditPrompt}
                  className="w-full"
                >
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setPage("home");
                    setEditingPrompt(undefined);
                    setTitle("");
                    setPromptContent("");
                    setCategory(categories[0]);
                  }}
                  className="w-full"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={!!deletePrompt} onOpenChange={() => setDeletePrompt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete "{deletePrompt?.title}"?
          </DialogDescription>
          <DialogFooter className="gap-2">
            <Button onClick={() => setDeletePrompt(null)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleDeletePrompt} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
