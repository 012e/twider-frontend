import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }


  return (
    <Button
      className="flex flex-row gap-1 items-center justify-center hover:cursor-pointer p-8"
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="size-7" />
      ) : (
        <Moon className="size-7" />
      )}
    </Button>
  );
}
