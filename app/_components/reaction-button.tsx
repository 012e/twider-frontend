"use client";

import { Button } from "@/components/ui/button";
import { ReactionType } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ReactionTemplate = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

const reactions: ReactionTemplate[] = [
  { id: "like", emoji: "👍", label: "Like", color: "text-blue-600" },
  { id: "love", emoji: "❤️", label: "Love", color: "text-red-600" },
  { id: "haha", emoji: "😂", label: "Haha", color: "text-yellow-600" },
  { id: "wow", emoji: "😮", label: "Wow", color: "text-yellow-600" },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-yellow-600" },
  { id: "angry", emoji: "😠", label: "Angry", color: "text-orange-600" },
];

export type ReactionButtonProps = {
  className?: string;
  selectedReaction?: ReactionType;
  onReactionSelect?: (reaction: ReactionType) => void;
} & React.HTMLAttributes<HTMLButtonElement>;

export default function ReactionButton({
  className,
  selectedReaction,
  onReactionSelect: onReactionSelectCallback,
  ...props
}: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [justSelected, setJustSelected] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseOverButton = useRef(false);
  const isMouseOverPopup = useRef(false);

  const selectedReactionTemplate = useMemo(() => {
    return reactions?.find((reaction) => reaction.id === selectedReaction);
  }, [selectedReaction]);

  const clearHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startHideTimeout = () => {
    clearHideTimeout();
    timeoutRef.current = setTimeout(() => {
      if (!isMouseOverButton.current && !isMouseOverPopup.current) {
        setShowReactions(false);
      }
    }, 200);
  };

  const handleMouseEnterButton = () => {
    isMouseOverButton.current = true;
    clearHideTimeout();
    setShowReactions(true);
  };

  const handleMouseLeaveButton = () => {
    isMouseOverButton.current = false;
    startHideTimeout();
  };

  const handleMouseEnterPopup = () => {
    isMouseOverPopup.current = true;
    clearHideTimeout();
  };

  const handleMouseLeavePopup = () => {
    isMouseOverPopup.current = false;
    startHideTimeout();
  };

  const handleReactionSelect = useCallback(
    (reaction: ReactionTemplate) => {
      setJustSelected(reaction.id);
      setShowReactions(false);
      clearHideTimeout();
      isMouseOverButton.current = false;
      isMouseOverPopup.current = false;

      // Clear the justSelected state after animation
      setTimeout(() => setJustSelected(null), 300);

      if (onReactionSelectCallback) {
        onReactionSelectCallback(reaction.id as ReactionType);
      }
    },
    [onReactionSelectCallback],
  );

  useEffect(() => {
    return () => {
      clearHideTimeout();
    };
  }, []);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
          selectedReaction && "text-primary font-medium",
          className,
        )}
        onMouseEnter={handleMouseEnterButton}
        onMouseLeave={handleMouseLeaveButton}
        {...props}
      >
        <AnimatePresence mode="wait">
          {selectedReactionTemplate ? (
            <motion.div
              key={`selected-${selectedReactionTemplate.id}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: justSelected === selectedReactionTemplate.id ? [1, 1.1, 1] : 1,
                opacity: 1 
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                duration: justSelected === selectedReactionTemplate.id ? 0.3 : 0.2,
                ease: "easeOut"
              }}
              className="flex items-center gap-2"
            >
              <motion.span 
                className="scale-125"
                animate={justSelected === selectedReactionTemplate.id ? {
                  y: [0, -2, 0],
                } : {}}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                {selectedReactionTemplate.emoji}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.15 }}
              >
                {selectedReactionTemplate.label}
              </motion.span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.15 }}
              >
                <ThumbsUp className="w-5 h-5 text-muted-foreground" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.15 }}
              >
                Like
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex absolute left-0 -top-2 z-10 gap-1 p-2 rounded-full border shadow-lg bg-popover text-popover-foreground border-border"
            onMouseEnter={handleMouseEnterPopup}
            onMouseLeave={handleMouseLeavePopup}
          >
            {reactions.map((reaction, index) => (
              <motion.button
                key={reaction.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                }}
                transition={{ 
                  duration: 0.15, 
                  delay: index * 0.03,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.15,
                  y: -1,
                  transition: { duration: 0.1 }
                }}
                whileTap={{ scale: 0.95 }}
                className="flex relative justify-center items-center w-10 h-10 rounded-full group hover:bg-muted"
                onClick={() => handleReactionSelect(reaction)}
              >
                <span className="text-2xl">
                  {reaction.emoji}
                </span>
                <motion.span
                  initial={{ opacity: 0, y: 3 }}
                  whileHover={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.1 }
                  }}
                  className="absolute -top-8 py-1 px-2 text-xs whitespace-nowrap rounded border opacity-0 transition-opacity group-hover:opacity-100 bg-card text-card-foreground border-border"
                >
                  {reaction.label}
                </motion.span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
