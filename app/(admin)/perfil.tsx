import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Alert,
	StatusBar,
	Platform,
	Modal,
	Pressable,
	ScrollView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Settings, LogOut, CheckCircle2, ChevronRight, Check, Sun, Moon, Smartphone, ShieldCheck, Mail } from "lucide-react-native";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfileScreen() {
	const { colors, isDark, themeMode, setThemeMode } = useTheme();
	const { profile, signOut } = useAuth();

	const [modalTemaVisivel, setModalTemaVisivel] = useState(false);

	const handleSair = () => {
		Alert.alert("Sair", "Deseja realmente deslogar?", [
			{ text: "Cancelar", style: "cancel" },
			{ text: "Sair", style: "destructive", onPress: signOut },
		]);
	};

	const selecionarTema = (modo: "light" | "dark" | "system") => {
		setThemeMode(modo);
		setModalTemaVisivel(false);
	};

	const styles = createStyles(colors);

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

				<SafeAreaView edges={["top"]} style={styles.safeHeader}>
					<View style={styles.header}>
						<Text style={styles.title}>Meu Perfil</Text>
					</View>
				</SafeAreaView>

				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
					<View style={styles.profileCard}>
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{profile?.full_name?.charAt(0).toUpperCase() || "A"}</Text>
							<View style={styles.adminBadgeIcon}>
								<ShieldCheck size={16} color="#FFFFFF" />
							</View>
						</View>

						<View style={styles.nameContainer}>
							<Text style={styles.name}>{profile?.full_name}</Text>
						</View>

						<Text style={styles.registration}>Matrícula: {profile?.matricula || "---"}</Text>

						<View style={[styles.statusBadge, styles.statusApproved]}>
							<CheckCircle2 size={14} color={colors.primary} />
							<Text style={[styles.statusText, { color: colors.primary }]}>Administrador</Text>
						</View>
					</View>

					<View style={styles.actionsContainer}>
						{/* Exibição do E-mail */}
						<View style={styles.actionButtonStatic}>
							<View style={styles.actionIcon}>
								<Mail size={20} color={colors.textMain} />
							</View>
							<View style={{ flex: 1 }}>
								<Text style={styles.actionLabel}>E-mail Institucional</Text>
								<Text style={styles.actionValue}>{profile?.email}</Text>
							</View>
						</View>

						<TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => setModalTemaVisivel(true)}>
							<View style={styles.actionIcon}>
								<Settings size={20} color={colors.textMain} />
							</View>
							<View style={{ flex: 1 }}>
								<Text style={styles.actionText}>Aparência</Text>
								<Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>
									{themeMode === "system" ?
										"Padrão do Sistema"
									: themeMode === "light" ?
										"Tema Claro"
									:	"Tema Escuro"}
								</Text>
							</View>
							<ChevronRight size={20} color={colors.textMuted} />
						</TouchableOpacity>

						<TouchableOpacity style={[styles.actionButton, { marginTop: 12 }]} activeOpacity={0.7} onPress={handleSair}>
							<View style={[styles.actionIcon, { backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : colors.dangerLight }]}>
								<LogOut size={20} color={colors.danger} />
							</View>
							<Text style={[styles.actionText, { color: colors.danger }]}>Sair do Aplicativo</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>

				{/* Modal de Tema */}
				<Modal visible={modalTemaVisivel} transparent={true} animationType="fade" onRequestClose={() => setModalTemaVisivel(false)}>
					<View style={styles.modalOverlay}>
						<Pressable style={styles.modalBackdrop} onPress={() => setModalTemaVisivel(false)} />
						<View style={styles.modalContent}>
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Escolher Aparência</Text>
							</View>
							<TouchableOpacity
								style={[styles.themeOption, themeMode === "light" && styles.themeOptionSelected]}
								onPress={() => selecionarTema("light")}
							>
								<Sun size={24} color={themeMode === "light" ? colors.primary : colors.textMuted} />
								<Text
									style={[styles.themeOptionText, themeMode === "light" && { color: colors.primary, fontWeight: "700" }]}
								>
									Claro
								</Text>
								{themeMode === "light" && <Check size={20} color={colors.primary} />}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.themeOption, themeMode === "dark" && styles.themeOptionSelected]}
								onPress={() => selecionarTema("dark")}
							>
								<Moon size={24} color={themeMode === "dark" ? colors.primary : colors.textMuted} />
								<Text
									style={[styles.themeOptionText, themeMode === "dark" && { color: colors.primary, fontWeight: "700" }]}
								>
									Escuro
								</Text>
								{themeMode === "dark" && <Check size={20} color={colors.primary} />}
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.themeOption, themeMode === "system" && styles.themeOptionSelected]}
								onPress={() => selecionarTema("system")}
							>
								<Smartphone size={24} color={themeMode === "system" ? colors.primary : colors.textMuted} />
								<Text
									style={[styles.themeOptionText, themeMode === "system" && { color: colors.primary, fontWeight: "700" }]}
								>
									Padrão do Sistema
								</Text>
								{themeMode === "system" && <Check size={20} color={colors.primary} />}
							</TouchableOpacity>
							<TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalTemaVisivel(false)}>
								<Text style={styles.modalCancelText}>Cancelar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		</SafeAreaProvider>
	);
}

const createStyles = (colors: any) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: colors.background },
		safeHeader: { backgroundColor: colors.background },
		header: { paddingHorizontal: 24, paddingVertical: 10 },
		title: { fontSize: 28, fontWeight: "800", color: colors.textMain, letterSpacing: -0.5 },
		scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140 },

		profileCard: {
			alignItems: "center",
			backgroundColor: colors.card,
			padding: 24,
			borderRadius: 30,
			marginBottom: 32,
			borderWidth: 1,
			borderColor: colors.border,
			shadowColor: "#000",
			shadowOffset: { width: 0, height: 8 },
			shadowOpacity: 0.05,
			shadowRadius: 15,
			elevation: 2,
		},
		avatar: {
			width: 80,
			height: 80,
			borderRadius: 40,
			backgroundColor: colors.primary,
			justifyContent: "center",
			alignItems: "center",
			marginBottom: 16,
			position: "relative",
		},
		avatarText: { fontSize: 32, fontWeight: "800", color: "#FFFFFF" },
		adminBadgeIcon: {
			position: "absolute",
			bottom: 0,
			right: 0,
			backgroundColor: colors.accent,
			borderRadius: 12,
			padding: 4,
			borderWidth: 2,
			borderColor: colors.card,
		},

		nameContainer: { marginBottom: 4, width: "100%", alignItems: "center" },
		nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
		name: { fontSize: 22, fontWeight: "800", color: colors.textMain },
		editRow: { flexDirection: "row", alignItems: "center", gap: 10, width: "90%" },
		input: {
			flex: 1,
			fontSize: 20,
			fontWeight: "700",
			color: colors.textMain,
			borderBottomWidth: 2,
			borderBottomColor: colors.accent,
			paddingVertical: 2,
		},
		saveBtn: {
			backgroundColor: colors.accent,
			width: 32,
			height: 32,
			borderRadius: 10,
			justifyContent: "center",
			alignItems: "center",
		},

		registration: { fontSize: 14, color: colors.textMuted, fontWeight: "500", marginBottom: 16 },

		statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
		statusApproved: { backgroundColor: colors.softGreen },
		statusText: { fontSize: 13, fontWeight: "700" },

		actionsContainer: { gap: 12 },
		actionButton: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.card,
			padding: 16,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.border,
		},
		actionButtonStatic: {
			flexDirection: "row",
			alignItems: "center",
			backgroundColor: colors.card,
			padding: 16,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: colors.border,
			opacity: 0.8,
		},
		actionIcon: {
			width: 40,
			height: 40,
			borderRadius: 12,
			backgroundColor: colors.background,
			justifyContent: "center",
			alignItems: "center",
			marginRight: 16,
		},
		actionText: { fontSize: 15, fontWeight: "700", color: colors.textMain, flex: 1 },
		actionLabel: { fontSize: 11, color: colors.textMuted, fontWeight: "700", textTransform: "uppercase" },
		actionValue: { fontSize: 14, color: colors.textMain, fontWeight: "600" },

		modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0, 0, 0, 0.4)" },
		modalBackdrop: { ...StyleSheet.absoluteFillObject },
		modalContent: {
			backgroundColor: colors.card,
			borderTopLeftRadius: 32,
			borderTopRightRadius: 32,
			padding: 24,
			paddingBottom: Platform.OS === "ios" ? 40 : 24,
		},
		modalHeader: { marginBottom: 20, alignItems: "center" },
		modalTitle: { fontSize: 20, fontWeight: "800", color: colors.textMain },
		themeOption: {
			flexDirection: "row",
			alignItems: "center",
			padding: 16,
			borderRadius: 16,
			marginBottom: 8,
			backgroundColor: colors.background,
			borderWidth: 1,
			borderColor: "transparent",
		},
		themeOptionSelected: { backgroundColor: colors.softGreen, borderColor: colors.accent },
		themeOptionText: { flex: 1, fontSize: 16, fontWeight: "600", color: colors.textMain, marginLeft: 16 },
		modalCancelButton: { marginTop: 16, padding: 16, alignItems: "center", borderRadius: 16, backgroundColor: colors.background },
		modalCancelText: { fontSize: 16, fontWeight: "700", color: colors.textMuted },
	});
