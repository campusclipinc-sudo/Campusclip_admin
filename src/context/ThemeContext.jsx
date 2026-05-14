import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext({ theme: "light", toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("admin_theme") : null;
    return saved === "dark" || saved === "light" ? saved : "light";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.setAttribute("data-theme", theme);
    }
    try {
      localStorage.setItem("admin_theme", theme);
    } catch (e) {
      // best-effort persistence; ignore quota or privacy errors
      void e;
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
