import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      {/* Define a busca como um modal para ficar mais elegante */}
      <Stack.Screen 
        name="search-subjects" 
        options={{ 
          presentation: 'modal', 
          animation: 'slide_from_bottom' 
        }} 
      />
    </Stack>
  );
}