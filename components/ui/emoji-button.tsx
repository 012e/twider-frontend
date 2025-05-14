"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
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

type EmojiPickerButtonProps = EmojiPickerButtonProps & React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  })
export default function EmojiPickerButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Button>
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <Button>Open emoji picker</Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-fit">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }) => {
              setIsOpen(false);
              console.log(emoji);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </Button>
  );
}
