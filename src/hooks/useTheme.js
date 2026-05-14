import { useContext } from "react";
import { createContext } from "react";

// Re-export the context from ThemeContext to keep a single source of truth
export { ThemeProvider } from "../context/ThemeContext";
export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => {
  return useContext(ThemeContext);
};
