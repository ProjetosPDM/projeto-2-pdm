import React from "react";
import { StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Settings, BookOpen, Plus, LayoutDashboard } from "lucide-react-native";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminDashboard() {
	const { colors, isDark } = useTheme();
	const { profile } = useAuth();
	const styles = createStyles(colors, isDark);

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

				{/* Header com SafeArea para o Admin */}
				<SafeAreaView edges={["top"]} style={styles.safeHeader}>
					<View style={styles.header}>
						<View>
							<Text style={styles.greetingText}>Painel Admin</Text>
							<View style={styles.dateRow}>
								<Settings size={14} color={colors.textMuted} />
								<Text style={styles.dateText}>Gerenciamento de Campus</Text>
							</View>
						</View>
					</View>
				</SafeAreaView>

				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
					{/* Card em destaque no estilo do Aluno */}
					<View style={styles.featuredSection}>
						<View style={styles.mainCard}>
							<Text style={styles.mainTitle}>Gestão Acadêmica</Text>
							<Text style={styles.mainSubtitle}>
								Olá, {profile?.full_name?.split(" ")[0]}. Você tem controle total sobre disciplinas e alunos.
							</Text>

							<View style={styles.statsRow}>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>--</Text>
									<Text style={styles.statLabel}>Disciplinas Cadastradas</Text>
								</View>
							</View>
						</View>
					</View>

					{/* Seção de Ações Rápidas */}
					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Disciplinas</Text>
						<TouchableOpacity style={styles.addBadge} activeOpacity={0.7}>
							<Plus size={14} color={colors.primary} strokeWidth={3} />
							<Text style={styles.addText}>NOVA</Text>
						</TouchableOpacity>
					</View>

					{/* Placeholder da Lista de Disciplinas seguindo o estilo pastCard */}
					<View style={styles.placeholderCard}>
						<BookOpen size={24} color={colors.textMuted} />
						<View style={styles.placeholderInfo}>
							<Text style={styles.placeholderTitle}>Nenhuma disciplina</Text>
							<Text style={styles.placeholderSub}>Comece cadastrando os horários do semestre.</Text>
						</View>
					</View>

					{/* Card Informativo de Uso */}
					<View style={[styles.infoCard, { backgroundColor: colors.softGreen }]}>
						<LayoutDashboard size={20} color={colors.primary} />
						<Text style={[styles.infoText, { color: colors.primary }]}>
							As disciplinas cadastradas aqui ficarão disponíveis para busca por todos os alunos aprovados.
						</Text>
					</View>
				</ScrollView>
			</View>
		</SafeAreaProvider>
	);
}

const createStyles = (colors: any, isDark: boolean) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: colors.background },
		safeHeader: { backgroundColor: colors.background },
		header: { paddingHorizontal: 24, paddingVertical: 10 },
		greetingText: {
			fontSize: 28,
			fontWeight: "800",
			color: colors.textMain,
			letterSpacing: -0.5,
		},
		dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
		dateText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
		scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140 }, // paddingBottom maior para a tab flutuante
		featuredSection: { marginBottom: 32 },
		mainCard: {
			backgroundColor: colors.primary,
			borderRadius: 30,
			padding: 26,
			shadowColor: colors.primary,
			shadowOffset: { width: 0, height: 12 },
			shadowOpacity: isDark ? 0.4 : 0.22,
			shadowRadius: 18,
			elevation: 8,
		},
		mainTitle: {
			fontSize: 22,
			fontWeight: "800",
			color: "#FFFFFF",
			marginBottom: 4,
		},
		mainSubtitle: {
			fontSize: 15,
			color: "rgba(255,255,255,0.7)",
			lineHeight: 22,
			marginBottom: 25,
		},
		statsRow: {
			flexDirection: "row",
			alignItems: "center",
			borderTopWidth: 1,
			borderTopColor: "rgba(255,255,255,0.1)",
			paddingTop: 20,
		},
		statItem: { flex: 1, alignItems: "center" },
		statValue: { color: "#FFF", fontSize: 20, fontWeight: "800" },
		statLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
		divider: { width: 1, height: 30, backgroundColor: "rgba(255,255,255,0.1)" },
		sectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.textMain },
		addBadge: {
			flexDirection: "row",
			alignItems: "center",
			gap: 4,
			backgroundColor: colors.softGreen,
			paddingHorizontal: 12,
			paddingVertical: 6,
			borderRadius: 10,
		},
		addText: { fontSize: 11, fontWeight: "900", color: colors.primary },
		placeholderCard: {
			flexDirection: "row",
			alignItems: "center",
			padding: 24,
			backgroundColor: colors.card,
			borderRadius: 24,
			gap: 18,
			borderWidth: 1,
			borderColor: colors.border,
			borderStyle: "dashed",
			marginBottom: 20,
		},
		placeholderInfo: { flex: 1 },
		placeholderTitle: { fontSize: 16, fontWeight: "700", color: colors.textMain },
		placeholderSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
		infoCard: {
			flexDirection: "row",
			padding: 16,
			borderRadius: 16,
			gap: 12,
			alignItems: "center",
		},
		infoText: { flex: 1, fontSize: 13, fontWeight: "600", lineHeight: 18 },
	});
