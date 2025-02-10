// ThemeToggle.jsx
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button variant="ghost" onClick={toggleTheme}>
      {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
    </Button>
  );
}
