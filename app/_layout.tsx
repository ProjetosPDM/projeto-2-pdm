import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

import { SubjectProvider } from "../context/SubjectContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";

import { inicializarBanco } from "@/utils/database";

SplashScreen.preventAutoHideAsync();

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
    const inSearchModal = firstSegment === "search-subjects"; 

    if (!session) {
      if (!inAuthGroup) {
        router.replace("/(auth)/login" as any);
      }
    } else {
      if (profile && !profile.is_approved) {
        const isPendingPage = segments[segments.length - 1] === "pending";
        if (!isPendingPage) {
          router.replace("/(auth)/pending" as any);
        }
      }
      else if (profile?.is_approved) {
        if (profile.role === 'admin') {
          if (!inAdminGroup) {
            router.replace("/(admin)" as any);
          }
        } else {
          if (!inTabsGroup && !inSearchModal) {
            router.replace("/(tabs)" as any);
          }
        }
      }
    }

    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 100);

  }, [session, profile, isLoading, segments]);

  if (isLoading) {
    return <View style={{ flex: 1, backgroundColor: "#F8FAFB" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFB" }}>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(admin)" />
        <Stack.Screen
          name="search-subjects"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
      </Stack>
    </View>
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

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#F8FAFB" }}>
        <ThemeProvider>
          <AuthProvider>
            <SubjectProvider>
              {!dbReady ? (
                <View style={{ flex: 1, backgroundColor: "#F8FAFB" }} />
              ) : (
                <InitialLayout />
              )}
            </SubjectProvider>
          </AuthProvider>
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}