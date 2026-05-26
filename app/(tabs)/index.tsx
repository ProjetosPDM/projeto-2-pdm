import React, { useMemo } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { MapPin, Clock, ChevronRight, CheckCircle2, Calendar, BookOpen } from "lucide-react-native";

import { useSubjects } from "../../context/SubjectContext";
import { useTheme } from "../../context/ThemeContext";
import { getFormattedDate, getToday, timeToMinutes, calculateProgress } from "@/utils/date";
import { EmptyState } from "@/components/EmptyState";

import { useAuth } from "../../context/AuthContext";

export default function HomeScreen() {
	const { mySubjects } = useSubjects();
	const { colors, isDark } = useTheme();
	const { profile } = useAuth();
	const currentDate = getFormattedDate();

	const hojeStatus = useMemo(() => {
		const diaLongo = getToday();
		const hojeNormalizado = diaLongo.toLowerCase().split("-")[0];
		const agoraEmMinutos = new Date().getHours() * 60 + new Date().getMinutes();

		const aulasDeHoje = mySubjects
			.filter((s) => s.schedule.toLowerCase() === hojeNormalizado)
			.sort((a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart));

		return {
			hojeNormalizado,
			aulaAtual: aulasDeHoje.find(
				(s) => agoraEmMinutos >= timeToMinutes(s.timeStart) && agoraEmMinutos <= timeToMinutes(s.timeEnd)
			),
			proximasAulas: aulasDeHoje.filter((s) => agoraEmMinutos < timeToMinutes(s.timeStart)),
			aulasEncerradas: aulasDeHoje.filter((s) => agoraEmMinutos > timeToMinutes(s.timeEnd)),
			temAulaHoje: aulasDeHoje.length > 0,
		};
	}, [mySubjects]);

	const { aulaAtual, proximasAulas, aulasEncerradas, temAulaHoje } = hojeStatus;
	const styles = createStyles(colors, isDark);

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

				<SafeAreaView edges={["top"]} style={styles.safeHeader}>
					<View style={styles.header}>
						<View>
							<Text style={styles.greetingText}>Olá, {profile?.full_name?.split(" ")[0] || "Estudante"}</Text>
							<View style={styles.dateRow}>
								<Calendar size={14} color={colors.textMuted} />
								<Text style={styles.dateText}>{currentDate}</Text>
							</View>
						</View>
					</View>
				</SafeAreaView>

				<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
					{aulaAtual && (
						<View style={styles.featuredSection}>
							<View style={styles.liveBadge}>
								<View style={styles.pulseDot} />
								<Text style={[styles.liveText, { color: colors.accent }]}>AULA AGORA</Text>
							</View>

							<View style={styles.mainCard}>
								<Text style={styles.mainSubject}>{aulaAtual.name}</Text>
								<Text style={styles.mainProfessor}>{aulaAtual.prof}</Text>

								<View style={styles.progressArea}>
									<View style={styles.progressTextRow}>
										<Text style={styles.progressLabel}>Tempo de aula</Text>
										<Text style={styles.progressPercent}>
											{calculateProgress(aulaAtual.timeStart, aulaAtual.timeEnd)}%
										</Text>
									</View>
									<View style={styles.progressTrack}>
										<View
											style={[
												styles.progressFill,
												{
													backgroundColor: colors.accent,
													width: `${calculateProgress(aulaAtual.timeStart, aulaAtual.timeEnd)}%`,
												},
											]}
										/>
									</View>
								</View>

								<View style={styles.mainFooter}>
									<View style={styles.footerItem}>
										<MapPin size={15} color="rgba(255,255,255,0.7)" />
										<Text style={styles.footerValue}>{aulaAtual.location}</Text>
									</View>
									<View style={styles.footerItem}>
										<Clock size={15} color="rgba(255,255,255,0.7)" />
										<Text style={styles.footerValue}>
											{aulaAtual.timeStart} - {aulaAtual.timeEnd}
										</Text>
									</View>
								</View>
							</View>
						</View>
					)}

					{!temAulaHoje && (
						<EmptyState
							icon={BookOpen}
							title="Sem aulas para hoje"
							description="Aproveite o tempo livre ou sincronize sua grade no perfil."
						/>
					)}

					{proximasAulas.length > 0 && (
						<>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Próximas do dia</Text>
								<View style={styles.countBadge}>
									<Text style={styles.countText}>{proximasAulas.length} restantes</Text>
								</View>
							</View>

							{proximasAulas.map((aula) => (
								<TouchableOpacity key={aula.id} activeOpacity={0.8} style={styles.scheduleCard}>
									<View style={styles.timeTag}>
										<Text style={styles.timeStart}>{aula.timeStart}</Text>
										<Text style={styles.timeEnd}>{aula.timeEnd}</Text>
									</View>
									<View style={styles.cardInfo}>
										<Text style={styles.subjectText}>{aula.name}</Text>
										<Text style={styles.profText}>
											{aula.prof} • {aula.location}
										</Text>
									</View>
									<ChevronRight size={18} color={colors.textMuted} strokeWidth={1.5} />
								</TouchableOpacity>
							))}
						</>
					)}

					{aulasEncerradas.length > 0 && (
						<>
							<Text style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}>Encerradas</Text>

							{aulasEncerradas.map((aula) => (
								<View key={aula.id} style={styles.pastCard}>
									<CheckCircle2 size={20} color={colors.accent} />
									<View style={styles.pastInfo}>
										<Text style={styles.pastTitle}>{aula.name}</Text>
										<Text style={styles.pastSub}>Finalizada às {aula.timeEnd}</Text>
									</View>
								</View>
							))}
						</>
					)}
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
		scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140 },
		featuredSection: { marginBottom: 35 },
		liveBadge: {
			flexDirection: "row",
			alignItems: "center",
			gap: 6,
			marginBottom: 12,
		},
		pulseDot: {
			width: 8,
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.accent,
		},
		liveText: {
			fontSize: 11,
			fontWeight: "900",
			letterSpacing: 1,
		},
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
		mainSubject: {
			fontSize: 22,
			fontWeight: "800",
			color: "#FFFFFF",
			marginBottom: 4,
		},
		mainProfessor: {
			fontSize: 15,
			color: "rgba(255,255,255,0.6)",
			marginBottom: 25,
		},
		progressArea: { marginBottom: 25 },
		progressTextRow: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginBottom: 8,
		},
		progressLabel: {
			fontSize: 11,
			color: "rgba(255,255,255,0.4)",
			fontWeight: "700",
		},
		progressPercent: { fontSize: 11, color: "#FFFFFF", fontWeight: "800" },
		progressTrack: {
			height: 6,
			backgroundColor: "rgba(255,255,255,0.1)",
			borderRadius: 3,
			overflow: "hidden",
		},
		progressFill: {
			height: "100%",
			borderRadius: 3,
		},
		mainFooter: {
			flexDirection: "row",
			gap: 20,
			borderTopWidth: 1,
			borderTopColor: "rgba(255,255,255,0.08)",
			paddingTop: 18,
		},
		footerItem: { flexDirection: "row", alignItems: "center", gap: 6 },
		footerValue: { color: "#FFFFFF", fontSize: 13, fontWeight: "600" },
		sectionHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: 16,
		},
		sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.textMain },
		countBadge: {
			backgroundColor: colors.border,
			paddingHorizontal: 10,
			paddingVertical: 4,
			borderRadius: 8,
		},
		countText: { fontSize: 11, fontWeight: "800", color: colors.textMuted },
		scheduleCard: {
			backgroundColor: colors.card,
			borderRadius: 24,
			padding: 18,
			flexDirection: "row",
			alignItems: "center",
			marginBottom: 12,
			borderWidth: 1,
			borderColor: colors.border,
		},
		timeTag: {
			alignItems: "center",
			paddingRight: 18,
			borderRightWidth: 1,
			borderRightColor: colors.border,
			width: 65,
		},
		timeStart: { fontSize: 15, fontWeight: "800", color: colors.textMain },
		timeEnd: { fontSize: 11, color: colors.textMuted, fontWeight: "700" },
		cardInfo: { flex: 1, paddingLeft: 18 },
		subjectText: {
			fontSize: 16,
			fontWeight: "700",
			color: colors.textMain,
			marginBottom: 2,
		},
		profText: { fontSize: 13, color: colors.textMuted, fontWeight: "500" },
		pastCard: {
			flexDirection: "row",
			alignItems: "center",
			padding: 18,
			backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(226, 232, 240, 0.3)",
			borderRadius: 20,
			gap: 15,
			borderWidth: 1,
			borderColor: colors.border,
			borderStyle: "dashed",
			marginBottom: 12,
		},
		pastInfo: { flex: 1 },
		pastTitle: { fontSize: 15, fontWeight: "700", color: colors.textMuted },
		pastSub: { fontSize: 13, color: colors.textMuted },
		noClassesToday: {
			alignItems: "center",
			justifyContent: "center",
			marginTop: 40,
			gap: 10,
		},
		noClassesText: { color: colors.textMuted, fontWeight: "600" },
	});
