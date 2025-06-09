import type { Prompt } from "@/types";
import { motion } from "framer-motion";
import { useState, type FC } from "react";
import { usePromptStore } from "../../store/prompt-store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

const CATEGORIES = [
  "General",
  "Writing",
  "Programming",
  "Analysis",
  "Creative",
  "Business",
  "Academic",
  "Personal",
  "Other",
];

interface AddPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingPrompt?: Prompt;
}

export const AddPromptDialog: FC<AddPromptDialogProps> = ({
  isOpen,
  onClose,
  editingPrompt,
}) => {
  const [title, setTitle] = useState(editingPrompt?.title || "");
  const [content, setContent] = useState(editingPrompt?.content || "");
  const [category, setCategory] = useState(
    editingPrompt?.category || CATEGORIES[0]
  );

  const { addPrompt, updatePrompt } = usePromptStore();

  const handleSave = () => {
    if (editingPrompt) {
      updatePrompt(editingPrompt.id, { title, content, category });
    } else {
      addPrompt({ title, content, category });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingPrompt ? "Edit Prompt" : "Add New Prompt"}
          </DialogTitle>
        </DialogHeader>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="animate-input"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] animate-input"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={handleSave} disabled={!title || !content}>
              Save
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
