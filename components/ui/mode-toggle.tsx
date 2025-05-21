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
      className="flex flex-row gap-1 justify-center items-center p-8 hover:cursor-pointer"
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
    >
      {theme === "dark" ? (
        <Sun className="size-7" suppressHydrationWarning/>
      ) : (
        <Moon className="size-7" suppressHydrationWarning/>
      )}
    </Button>
  );
}
