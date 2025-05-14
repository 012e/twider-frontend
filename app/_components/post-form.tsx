"use client";

import type React from "react";

import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, ImageIcon, Globe, User, SmilePlus } from "lucide-react";
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

interface ImagePreview {
  url: string;
  file: File;
}

export default function PostForm() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const MAX_CHARS = 280;
  const MAX_IMAGES = 4;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages: ImagePreview[] = [];

      Array.from(e.target.files).forEach((file) => {
        if (images.length + newImages.length < MAX_IMAGES) {
          const url = URL.createObjectURL(file);
          newImages.push({ url, file });
        }
      });

      setImages([...images, ...newImages]);
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    // Here you would typically send the post to an API
    console.log("Posting:", { text, images: images.map((img) => img.file) });
    alert("Post submitted!");
    setText("");
    setImages([]);
  };

  const charsRemaining = MAX_CHARS - text.length;
  const isOverLimit = charsRemaining < 0;
  const canPost = (text.length > 0 && !isOverLimit) || images.length > 0;

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
            value={text}
            minHeight={0}
            onChange={handleTextChange}
          />

          {images.length > 0 && (
            <div
              className={cn(
                "grid gap-2 mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700",
                images.length === 1 && "grid-cols-1",
                images.length === 2 && "grid-cols-2",
                images.length === 3 && "grid-cols-2",
                images.length === 4 && "grid-cols-2",
              )}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative group",
                    images.length === 3 && index === 0 && "row-span-2",
                    "aspect-square",
                  )}
                >
                  <img
                    src={img.url || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-black/50"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

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
                        text.slice(0, start) + emoji + text.slice(end);
                      setText(newText);

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

              {text.length > 0 && (
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
