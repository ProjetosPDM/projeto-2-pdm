import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import { CalendarRange, Users, UserCircle } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

const { width } = Dimensions.get("window");

export default function AdminLayout() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: [
          styles.navBar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderTopWidth: isDark ? 1 : 0,
            bottom: Math.max(insets.bottom + 8, 28),
          },
        ],
        tabBarLabelStyle: [styles.navLabel, { color: colors.textMuted }],
        tabBarItemStyle: styles.navItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Horários",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.pillIndicator,
                focused && { backgroundColor: colors.softGreen }
                ]}
            >
              <CalendarRange
                size={24}
                color={focused ? colors.primary : color}
                strokeWidth={focused ? 2.5 : 1.5} 
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="alunos"
        options={{
          title: "Alunos",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.pillIndicator,
                focused && { backgroundColor: colors.softGreen }
                ]}
            >
              <Users
              size={24}
              color={focused ? colors.primary : color}
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
                focused && { backgroundColor: colors.softGreen }
                ]}
            >
              <UserCircle
                size={24}
                color={focused ? colors.primary : color}
                strokeWidth={focused ? 2.5 : 1.5} 
              />
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
    borderRadius: 35,
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