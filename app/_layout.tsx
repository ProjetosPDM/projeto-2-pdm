import { Stack } from 'expo-router';
import { SubjectProvider } from '../context/SubjectContext'; 
import { ThemeProvider } from '../context/ThemeContext'; // Importação do novo contexto de tema

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SubjectProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen 
            name="search-subjects" 
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
          />
        </Stack>
      </SubjectProvider>
    </ThemeProvider>
  );
}