"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Globe, User, SmilePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AutosizeTextarea,
  AutosizeTextAreaRef,
} from "@/components/ui/auto-resize-textarea";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "../../app/_components/client-providers";
import ImageList from "./media-list";
import { usePostFormContext } from "./stores/post-form-provider";
import { MediaFile } from "./stores/post-form-store";

const MAX_CHARS = 1000;
const MAX_IMAGES = 4;

export default function PostForm() {
  const content = usePostFormContext((state) => state.content);
  const images = usePostFormContext((state) => state.images);
  const {
    setContent,
    addImages,
    reset: resetForm,
    removeImage,
    uploadPost,
  } = usePostFormContext((state) => state.actions);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const { mutateAsync, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      await uploadPost();
    },

    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: () => {
      toast.error("Failed to submit post");
    },
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: MediaFile[] = [];

      Array.from(e.target.files).forEach((file) => {
        if (images.length + newImages.length < MAX_IMAGES) {
          const url = URL.createObjectURL(file);
          newImages.push({ previewUrl: url, file });
        }
      });

      addImages(newImages);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    await mutateAsync();
    resetForm();
  };

  const charsRemaining = MAX_CHARS - content.length;
  const isOverLimit = charsRemaining < 0;

  const canPost = useMemo(() => {
    return content.length > 0 && !isOverLimit && !isUploading;
  }, [content, isOverLimit, isUploading]);

  return (
    <div className="p-4 rounded-xl border shadow-sm bg-card">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 pt-1">
          <AutosizeTextarea
            ref={textareaRef}
            placeholder="What's happening?"
            className="p-0 text-2xl tracking-tight border-none ring-0 ring-transparent ring-offset-0 shadow-none resize-none focus:border-none focus:ring-0 focus:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0 bg-card"
            value={content}
            minHeight={0}
            onChange={handleTextChange}
          />

          <ImageList onRemoveImage={removeImage} />

          <div className="flex justify-between items-center pt-3 mt-4 border-t">
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 rounded-full dark:text-blue-400"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES}
                aria-label="Add image"
              >
                <ImageIcon className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-blue-500 rounded-full dark:text-blue-400"
              >
                <Globe className="w-5 h-5" />
              </Button>

              <Popover onOpenChange={setIsOpen} open={isOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 rounded-full dark:text-blue-400"
                  >
                    <SmilePlus />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-fit">
                  <EmojiPicker
                    className="h-[342px]"
                    onEmojiSelect={({ emoji }) => {
                      if (!textareaRef.current) return;

                      const textarea = textareaRef.current.textArea;
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;

                      const newText =
                        content.slice(0, start) + emoji + content.slice(end);
                      setContent(newText);

                      // Move the cursor after the inserted emoji
                      requestAnimationFrame(() => {
                        textarea.selectionStart = textarea.selectionEnd =
                          start + emoji.length;
                      });
                    }}
                  >
                    <EmojiPickerSearch />
                    <EmojiPickerContent />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>

              {content.length > 0 && (
                <div
                  className={cn(
                    "ml-2 text-sm",
                    isOverLimit
                      ? "text-red-500"
                      : charsRemaining <= 20
                        ? "text-yellow-500"
                        : "text-gray-500",
                  )}
                >
                  {charsRemaining}
                </div>
              )}
            </div>

            <Button
              className="rounded-full"
              disabled={!canPost}
              onClick={handleSubmit}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
