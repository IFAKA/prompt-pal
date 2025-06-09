import { ClipboardCheck, Copy, Pencil, Trash2 } from "lucide-react";
import { type FC, useState } from "react";
import { usePromptStore } from "../../store/prompt-store";
import type { Prompt } from "../../types";
import { Button } from "../ui/button";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (prompt: Prompt) => void;
}

export const PromptCard: FC<PromptCardProps> = ({
  prompt,
  onEdit,
  onDelete,
}) => {
  const incrementUsage = usePromptStore((state) => state.incrementUsage);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      incrementUsage(prompt.id);
      setIsCopied(true);

      // Reset states after animation
      setTimeout(() => {
        setIsCopied(false);
      }, 600);
    } catch (error) {
      console.error("Failed to copy prompt:", error);
    }
  };

  return (
    <div
      className="cursor-pointer flex border items-center justify-between px-3 py-1 rounded-md shadow-sm hover:shadow-md group transition-all duration-200 ease-in-out active:scale-95"
      onClick={handleCopy}
    >
      <h3 className="font-medium text-lg">{prompt.title}</h3>
      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
        >
          {isCopied ? (
            <ClipboardCheck className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(prompt);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(prompt);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
