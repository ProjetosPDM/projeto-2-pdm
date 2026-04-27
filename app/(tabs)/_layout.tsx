import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { LayoutGrid, BookOpen, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 

const COLORS = {
  primary: "#064E3B",
  textMuted: "#718096",
  softGreen: "#F0FDF4",
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
        tabBarStyle:[
          styles.navBar,
          {
             
            bottom: Math.max(insets.bottom + 15, 20),
          }
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
            <View style={[styles.pillIndicator, focused && { backgroundColor: COLORS.softGreen }]}>
              <LayoutGrid size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="grade"
        options={{
          title: "Grade",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.pillIndicator, focused && { backgroundColor: COLORS.softGreen }]}>
              <BookOpen size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.pillIndicator, focused && { backgroundColor: COLORS.softGreen }]}>
              <User size={22} color={color} strokeWidth={focused ? 2.5 : 1.5} />
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
    left: 20,
    right: 20,
    height: 70, 
    backgroundColor: COLORS.white,
    borderRadius: 35,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderTopWidth: 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 0, 
    paddingBottom: Platform.OS === 'ios' ? 10 : 0, 
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  pillIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 2, 
  },
  navLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5, 
  },
});