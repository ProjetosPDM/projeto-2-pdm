import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function PendingScreen() {
	const { colors } = useTheme();
	const { signOut } = useAuth();
	const styles = createStyles(colors);

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Clock color={colors.primary} size={64} style={{ marginBottom: 24 }} />
				<Text style={styles.title}>Conta em Análise</Text>
				<Text style={styles.text}>
					Seu cadastro foi recebido com sucesso! Como medida de segurança, o administrador precisa aprovar o seu acesso.
				</Text>
				<Text style={styles.textBold}>Por favor, aguarde a liberação.</Text>
			</View>

			<TouchableOpacity style={styles.button} onPress={signOut} activeOpacity={0.8}>
				<Text style={styles.buttonText}>Sair</Text>
			</TouchableOpacity>
		</View>
	);
}

const createStyles = (colors: any) =>
	StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: "center",
			padding: 24,
			backgroundColor: colors.background,
		},
		card: {
			backgroundColor: colors.card,
			padding: 32,
			borderRadius: 24,
			alignItems: "center",
			borderWidth: 1,
			borderColor: colors.border,
		},
		title: {
			fontSize: 24,
			fontWeight: "800",
			color: colors.textMain,
			marginBottom: 16,
			textAlign: "center",
		},
		text: {
			fontSize: 16,
			color: colors.textMuted,
			textAlign: "center",
			lineHeight: 24,
			marginBottom: 16,
		},
		textBold: {
			fontSize: 16,
			color: colors.primary,
			fontWeight: "700",
			textAlign: "center",
		},
		button: {
			marginTop: 24,
			paddingVertical: 16,
			alignItems: "center",
		},
		buttonText: {
			color: colors.danger,
			fontSize: 16,
			fontWeight: "700",
		},
	});
