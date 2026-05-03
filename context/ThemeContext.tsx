import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import { ThemeColors } from "../constants/Colors";

import { buscarTemaDB, salvarTemaDB } from "../utils/database";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextData {
  colors: typeof ThemeColors.light;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    const carregarTemaConfigurado = async () => {
      const temaSalvo = await buscarTemaDB();
      setThemeModeState(temaSalvo as ThemeMode);
    };
    carregarTemaConfigurado();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await salvarTemaDB(mode);
  };

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const colors = isDark ? ThemeColors.dark : ThemeColors.light;

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
