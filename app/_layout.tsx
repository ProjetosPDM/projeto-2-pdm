import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";

import { SubjectProvider } from "../context/SubjectContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { inicializarBanco } from "@/utils/database";

function InitialLayout() {
  const { session, profile, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const firstSegment = segments[0] as string;

    const inAuthGroup = firstSegment === "(auth)";
    const inAdminGroup = firstSegment === "(admin)";
    const inTabsGroup = firstSegment === "(tabs)";

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    } else {
      if (profile && !profile.is_approved) {
        
        const isPendingPage = segments[segments.length - 1] === "pending";
        
        if (!isPendingPage) {
          router.replace("/(auth)/pending");
        }
      } 
      else if (profile?.is_approved) {
        if (inAuthGroup) {
          router.replace("/(tabs)");
        }
      }
    }
  }, [session, profile, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="search-subjects"
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const prepararBanco = async () => {
      await inicializarBanco();
      setDbReady(true);
    };
    
    prepararBanco();
  }, []);

  if (!dbReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <SubjectProvider>
          <InitialLayout />
        </SubjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
