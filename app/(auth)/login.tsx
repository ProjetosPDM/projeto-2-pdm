import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Link } from "expo-router";
import { Mail, Lock } from "lucide-react-native";
import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/authService";

export default function LoginScreen() {
	const { colors } = useTheme();
	const styles = createStyles(colors);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) return Alert.alert("Erro", "Preencha todos os campos.");
		setLoading(true);
		const { error } = await authService.signIn(email, password);
		setLoading(false);
		if (error) Alert.alert("Falha no Login", "Email ou senha incorretos.");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				Horário <Text style={{ color: colors.primary }}>IFPB</Text>
			</Text>
			<Text style={styles.subtitle}>Faça login para acessar sua grade</Text>

			<View style={styles.inputContainer}>
				<Mail color={colors.textMuted} size={20} style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="E-mail Institucional"
					placeholderTextColor={colors.textMuted}
					autoCapitalize="none"
					keyboardType="email-address"
					value={email}
					onChangeText={setEmail}
				/>
			</View>

			<View style={styles.inputContainer}>
				<Lock color={colors.textMuted} size={20} style={styles.icon} />
				<TextInput
					style={styles.input}
					placeholder="Senha"
					placeholderTextColor={colors.textMuted}
					secureTextEntry
					value={password}
					onChangeText={setPassword}
				/>
			</View>

			<TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading} activeOpacity={0.8}>
				{loading ?
					<ActivityIndicator color="#fff" />
				:	<Text style={styles.buttonText}>Entrar</Text>}
			</TouchableOpacity>

			<Link href="/(auth)/register" asChild>
				<TouchableOpacity style={styles.linkButton}>
					<Text style={styles.linkText}>
						Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
					</Text>
				</TouchableOpacity>
			</Link>
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
		title: {
			fontSize: 36,
			fontWeight: "800",
			color: colors.textMain,
			textAlign: "center",
		},
		subtitle: {
			fontSize: 16,
			color: colors.textMuted,
			textAlign: "center",
			marginBottom: 40,
			marginTop: 8,
		},
		inputContainer: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.card,
			borderRadius: 16,
			marginBottom: 16,
			paddingHorizontal: 16,
			borderWidth: 1,
			borderColor: colors.border,
		},
		icon: {
			marginRight: 12,
		},
		input: {
			flex: 1,
			paddingVertical: 16,
			fontSize: 16,
			color: colors.textMain,
		},
		button: {
			backgroundColor: colors.primary,
			paddingVertical: 16,
			borderRadius: 16,
			alignItems: "center",
			marginTop: 16,
		},
		buttonText: {
			color: "#FFF",
			fontSize: 16,
			fontWeight: "700",
		},
		linkButton: {
			marginTop: 24,
			alignItems: "center",
		},
		linkText: {
			color: colors.textMuted,
			fontSize: 14,
		},
		linkBold: {
			color: colors.primary,
			fontWeight: "700",
		},
	});
