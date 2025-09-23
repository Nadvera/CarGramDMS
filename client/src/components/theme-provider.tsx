import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isManuallySet, setIsManuallySet] = useState<boolean>(false);

  // Function to get time-based theme
  const getTimeBasedTheme = (): Theme => {
    const hour = new Date().getHours();
    // Dark theme from 6 PM to 6 AM (18:00 to 06:00)
    return (hour >= 18 || hour < 6) ? 'dark' : 'light';
  };

  useEffect(() => {
    const root = window.document.documentElement;

    // Check for saved theme preference or use time-based theme
    const savedTheme = localStorage.getItem("theme") as Theme;
    const isManual = localStorage.getItem("theme-manual") === "true";

    if (savedTheme) {
      setTheme(savedTheme);
      setIsManuallySet(isManual);
    } else {
      const timeBasedTheme = getTimeBasedTheme();
      setTheme(timeBasedTheme);
      setIsManuallySet(false);
    }

    root.classList.remove("light", "dark");
    root.classList.add(savedTheme || getTimeBasedTheme());
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-manual", isManuallySet.toString());
  }, [theme, isManuallySet]);

  // Auto-update theme based on time if no manual preference is set
  useEffect(() => {
    const interval = setInterval(() => {
      const isManual = localStorage.getItem("theme-manual") === "true";
      if (!isManual) {
        const timeBasedTheme = getTimeBasedTheme();
        if (timeBasedTheme !== theme) {
          setTheme(timeBasedTheme);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [theme, getTimeBasedTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem("theme", theme);
      localStorage.setItem("theme-manual", "true");
      setTheme(theme);
      setIsManuallySet(true);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};