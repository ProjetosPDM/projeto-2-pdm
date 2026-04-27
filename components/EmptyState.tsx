import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from "react-native";
import { LucideIcon } from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  primary: "#064E3B",
  softGreen: "#F0FDF4",
  white: "#FFFFFF",
  textMain: "#1A202C",
  textMuted: "#718096",
};

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPressed?: () => void;
  isCentered?: boolean;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onActionPressed,
  isCentered = true,
}: EmptyStateProps) => {
  const containerStyle: ViewStyle = {
    flexGrow: 1,
    justifyContent: isCentered ? "center" : "flex-start",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 32,
    minHeight: isCentered ? SCREEN_HEIGHT * 0.6 : 0,
  };

  return (
    <View style={containerStyle}>
      <View style={styles.iconContainer}>
        <Icon size={44} color={COLORS.primary} strokeWidth={1.5} />
      </View>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.description}>{description}</Text>

      {actionLabel && onActionPressed && (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={onActionPressed}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.softGreen,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.textMain,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
