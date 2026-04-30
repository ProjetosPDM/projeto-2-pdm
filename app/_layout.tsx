import { Stack } from 'expo-router';
import { SubjectProvider } from '../context/SubjectContext'; 

export default function RootLayout() {
  return (
    <SubjectProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="search-subjects" 
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }} 
        />
      </Stack>
    </SubjectProvider>
  );
}