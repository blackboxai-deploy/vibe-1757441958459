import React from 'react';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`${className} relative`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun className={`h-4 w-4 transition-all ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;