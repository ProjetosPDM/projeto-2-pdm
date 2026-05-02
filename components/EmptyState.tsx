import React from "react";
import { LucideIcon } from "lucide-react-native";

import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { useTheme } from "../context/ThemeContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
  isCentered = true
}: EmptyStateProps) => {
	const { colors, isDark } = useTheme();

	const styles = createStyles(colors);

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
				<Icon size={44} color={isDark ? colors.textMain : colors.primary} strokeWidth={1.5} />
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

const createStyles = (colors: any) => StyleSheet.create({
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.softGreen,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.textMain,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  button: {
    backgroundColor: colors.primary,
    width: "100%",
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});