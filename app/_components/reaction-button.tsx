"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type Reaction = {
  id: string;
  emoji: string;
  label: string;
  color: string; // This will now typically refer to text/icon color or an explicit background if needed
};

const reactions: Reaction[] = [
  { id: "like", emoji: "👍", label: "Like", color: "text-blue-600" }, // Using a more neutral blue, you might consider 'text-primary'
  { id: "love", emoji: "❤️", label: "Love", color: "text-red-600" }, // Using a more neutral red
  { id: "haha", emoji: "😂", label: "Haha", color: "text-yellow-600" }, // Using a more neutral yellow
  { id: "wow", emoji: "😮", label: "Wow", color: "text-yellow-600" },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-yellow-600" },
  { id: "angry", emoji: "😠", label: "Angry", color: "text-orange-600" }, // Using a more neutral orange
];

export type ReactionButtonProps = {
  className?: string;
  onReactionSelect?: (reaction: Reaction) => void;
};

export default function ReactionButton({
  className,
  onReactionSelect: onReactionSelectCallback,
}: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<Reaction | null>(
    null,
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMouseOverButton = useRef(false);
  const isMouseOverPopup = useRef(false);

  const clearHideTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const startHideTimeout = () => {
    clearHideTimeout(); // Clear any existing timeout before starting a new one
    timeoutRef.current = setTimeout(() => {
      // Only hide if mouse is not over button or popup
      if (!isMouseOverButton.current && !isMouseOverPopup.current) {
        setShowReactions(false);
      }
    }, 200); // Adjust delay as needed
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

  const handleReactionSelect = useCallback((reaction: Reaction) => {
    setSelectedReaction(reaction);
    setShowReactions(false);
    clearHideTimeout(); // Ensure popup hides immediately on selection
    // Reset hover states as interaction is complete
    isMouseOverButton.current = false;
    isMouseOverPopup.current = false;

    if (onReactionSelectCallback) {
      onReactionSelectCallback(reaction);
    }
  }, [onReactionSelectCallback]);

  // Clear timeout on component unmount
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
          "flex items-center gap-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors", // Using Shadcn's accent for hover
          selectedReaction && "text-primary font-medium", // Using Shadcn's primary for selected reaction text
          className,
        )}
        onMouseEnter={handleMouseEnterButton}
        onMouseLeave={handleMouseLeaveButton}
      >
        {selectedReaction ? (
          <>
            <span className="text-xl">{selectedReaction.emoji}</span>
            <span>{selectedReaction.label}</span>
          </>
        ) : (
          <>
            <ThumbsUp className="w-5 h-5 text-muted-foreground" />{" "}
            {/* Using muted-foreground for default icon color */}
            <span>Like</span>
          </>
        )}
      </Button>

      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: -50 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="flex absolute left-0 -top-2 z-10 gap-1 p-2 rounded-full border shadow-lg bg-popover text-popover-foreground border-border" // Using Shadcn's popover for background, text, and border
            onMouseEnter={handleMouseEnterPopup}
            onMouseLeave={handleMouseLeavePopup}
          >
            {reactions.map((reaction) => (
              <motion.button
                key={reaction.id}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.95 }}
                className="flex relative justify-center items-center w-10 h-10 rounded-full group hover:bg-muted" // Using Shadcn's muted for hover background
                onClick={() => handleReactionSelect(reaction)}
              >
                <span className="text-2xl">{reaction.emoji}</span>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 py-1 px-2 text-xs whitespace-nowrap rounded border opacity-0 transition-opacity group-hover:opacity-100 bg-card text-card-foreground border-border" // Using Shadcn's card for background and text, and border
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
