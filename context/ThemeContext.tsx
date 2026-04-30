// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors } from '../constants/Colors';
// Importação das funções de banco de dados para persistência
import { buscarTemaDB, salvarTemaDB } from '../utils/database';

// Definindo os tipos de tema possíveis
type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
  colors: typeof ThemeColors.light;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme(); // Tema do Android/iOS
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  // 1. Carrega a preferência de tema salva no SQLite ao iniciar o app
  useEffect(() => {
    const carregarTemaConfigurado = async () => {
      const temaSalvo = await buscarTemaDB();
      setThemeModeState(temaSalvo as ThemeMode);
    };
    carregarTemaConfigurado();
  }, []);

  // 2. Função para alterar o tema e salvar no banco
  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await salvarTemaDB(mode);
  };

  // 3. Lógica para decidir se o app deve estar no modo escuro ou não
  // Se for 'system', ele olha o sistema. Se for manual, ele obedece o estado.
  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark' 
    : themeMode === 'dark';

  // Define as cores baseadas no cálculo acima
  const colors = isDark ? ThemeColors.dark : ThemeColors.light;

  return (
    <ThemeContext.Provider value={{ colors, isDark, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);