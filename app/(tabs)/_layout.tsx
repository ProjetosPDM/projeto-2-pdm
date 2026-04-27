import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { LayoutGrid, BookOpen, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#064E3B",
  textMuted: "#718096",
  softGreen: "#E8FFEF",
  white: "#FFFFFF",
};

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: [
          styles.navBar,
          {
            bottom: Math.max(insets.bottom + 8, 28),
          },
        ],
        tabBarLabelStyle: styles.navLabel,
        tabBarItemStyle: styles.navItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.pillIndicator,
                focused && { backgroundColor: COLORS.softGreen },
              ]}
            >
              <LayoutGrid
                size={24}
                color={color}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="grade"
        options={{
          title: "Grade",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.pillIndicator,
                focused && { backgroundColor: COLORS.softGreen },
              ]}
            >
              <BookOpen
                size={24}
                color={color}
                strokeWidth={focused ? 2.5 : 1.5}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.pillIndicator,
                focused && { backgroundColor: COLORS.softGreen },
              ]}
            >
              <User size={24} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    alignSelf: "center",
    marginHorizontal: 24,
    left: width * 0.06,
    right: width * 0.06,
    height: 75,
    backgroundColor: COLORS.white,
    borderRadius: 35,
    borderTopWidth: 0,
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    paddingBottom: Platform.OS === "ios" ? 0 : 12,
    paddingTop: 12,
  },
  navItem: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  pillIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: -2,
    marginBottom: 4,
  },
});
