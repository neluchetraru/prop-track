import { useColorScheme as useRNColorScheme } from "react-native";
import { useState, useCallback } from "react";

export function useColorScheme() {
  const systemScheme = useRNColorScheme();
  const [scheme, setScheme] = useState<"light" | "dark" | null>(null);

  const isDarkColorScheme = (scheme ?? systemScheme) === "dark";
  const colorScheme = scheme ?? systemScheme;

  const toggleColorScheme = useCallback(() => {
    setScheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { colorScheme, isDarkColorScheme, toggleColorScheme };
}
