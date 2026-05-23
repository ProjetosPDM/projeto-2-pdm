import React, { useState, useEffect } from "react";
import { 
	StyleSheet, Text, View, ScrollView, StatusBar, 
	TouchableOpacity, Modal, TextInput, Alert, Platform, ActivityIndicator 
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Settings, BookOpen, Plus, LayoutDashboard, X, Clock, Trash2, CheckCircle2 } from "lucide-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "@/services/adminService";

const DIAS_SEMANA = [
	{ label: 'Segunda', value: 'segunda' },
	{ label: 'Terça', value: 'terca' },
	{ label: 'Quarta', value: 'quarta' },
	{ label: 'Quinta', value: 'quinta' },
	{ label: 'Sexta', value: 'sexta' },
];

export default function AdminDashboard() {
	const { colors, isDark } = useTheme();
	const { profile } = useAuth();
	const styles = createStyles(colors, isDark);

	const [subjects, setSubjects] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const [modalVisible, setModalVisible] = useState(false);
	const [nome, setNome] = useState('');
	const [professor, setProfessor] = useState('');
	const [local, setLocal] = useState('');
	const [horariosTemporarios, setHorariosTemporarios] = useState<any[]>([]);
	
	const [diaSelecionado, setDiaSelecionado] = useState('segunda'); 
	const [horaInicio, setHoraInicio] = useState(new Date());
	const [horaFim, setHoraFim] = useState(new Date());
	const [showPicker, setShowPicker] = useState<'inicio' | 'fim' | null>(null);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		const { data, error } = await adminService.getDisciplinas();
		if (data) setSubjects(data);
		setIsLoading(false);
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	};

	const adicionarHorario = () => {
		const diaObj = DIAS_SEMANA.find(d => d.value === diaSelecionado);
		
		const novo = {
			dia_semana: diaSelecionado, 
			dia_label: diaObj?.label,  
			hora_inicio: formatTime(horaInicio),
			hora_fim: formatTime(horaFim)
		};
		setHorariosTemporarios([...horariosTemporarios, novo]);
	};

	const handleSave = async () => {
		if (!nome || !professor || horariosTemporarios.length === 0) {
			Alert.alert("Erro", "Preencha todos os campos e adicione ao menos um horário.");
			return;
		}

		const horariosParaEnviar = horariosTemporarios.map(h => ({
			dia_semana: h.dia_semana,
			hora_inicio: h.hora_inicio,
			hora_fim: h.hora_fim
		}));

		const { error } = await adminService.createSubject(
			{ nome, professor, local },
			horariosParaEnviar
		);

		if (error) {
			Alert.alert("Erro ao salvar", error.message);
		} else {
			Alert.alert("Sucesso", "Disciplina cadastrada!");
			setModalVisible(false);
			resetForm();
			fetchData();
		}
	};

	const handleDelete = (id: string, name: string) => {
		Alert.alert("Excluir", `Deseja apagar a disciplina ${name}?`, [
			{ text: "Cancelar", style: "cancel" },
			{ text: "Excluir", style: "destructive", onPress: async () => {
				await adminService.deleteSubject(id);
				fetchData();
			}}
		]);
	};

	const resetForm = () => {
		setNome(''); setProfessor(''); setLocal(''); setHorariosTemporarios([]);
	};

	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

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
					<View style={styles.featuredSection}>
						<View style={styles.mainCard}>
							<Text style={styles.mainTitle}>Gestão Acadêmica</Text>
							<Text style={styles.mainSubtitle}>
								Olá, {profile?.full_name?.split(" ")[0]}. Você tem controle total sobre disciplinas e alunos.
							</Text>

							<View style={styles.statsRow}>
								<View style={styles.statItem}>
									<Text style={styles.statValue}>{subjects.length}</Text>
									<Text style={styles.statLabel}>Disciplinas Ativas</Text>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.sectionHeader}>
						<Text style={styles.sectionTitle}>Disciplinas</Text>
						<TouchableOpacity 
							style={styles.addBadge} 
							activeOpacity={0.7}
							onPress={() => setModalVisible(true)}
						>
							<Plus size={14} color={colors.primary} strokeWidth={3} />
							<Text style={styles.addText}>NOVA</Text>
						</TouchableOpacity>
					</View>

					{isLoading ? (
						<ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
					) : subjects.length === 0 ? (
						<View style={styles.placeholderCard}>
							<BookOpen size={24} color={colors.textMuted} />
							<View style={styles.placeholderInfo}>
								<Text style={styles.placeholderTitle}>Nenhuma disciplina</Text>
								<Text style={styles.placeholderSub}>Comece cadastrando os horários do semestre.</Text>
							</View>
						</View>
					) : (
						subjects.map(item => (
							<View key={item.id} style={styles.subjectListItem}>
								<View style={{ flex: 1 }}>
									<Text style={styles.subjectName}>{item.nome}</Text>
									<Text style={styles.subjectProf}>{item.professor} • {item.local}</Text>
									<Text style={styles.subjectHours}>
										{item.horarios_disciplina?.length} horário(s) vinculado(s)
									</Text>
								</View>
								<TouchableOpacity onPress={() => handleDelete(item.id, item.nome)}>
									<Trash2 size={20} color={colors.danger} />
								</TouchableOpacity>
							</View>
						))
					)}

					<View style={[styles.infoCard, { backgroundColor: colors.softGreen, marginTop: 20 }]}>
						<LayoutDashboard size={20} color={colors.primary} />
						<Text style={[styles.infoText, { color: colors.primary }]}>
							As disciplinas cadastradas aqui ficarão disponíveis para busca por todos os alunos aprovados.
						</Text>
					</View>
				</ScrollView>

				<Modal visible={modalVisible} animationType="slide" transparent>
					<View style={styles.modalOverlay}>
						<SafeAreaView style={[styles.modalContent, { backgroundColor: colors.background }]}>
							<View style={styles.modalHeader}>
								<Text style={[styles.modalTitle, { color: colors.textMain }]}>Nova Disciplina</Text>
								<TouchableOpacity onPress={() => setModalVisible(false)}>
									<X size={24} color={colors.textMain} />
								</TouchableOpacity>
							</View>

							<ScrollView style={{ padding: 20 }}>
								<TextInput 
									placeholder="Nome da Disciplina" 
									style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.card }]}
									value={nome} onChangeText={setNome}
									placeholderTextColor={colors.textMuted}
								/>
								<TextInput 
									placeholder="Professor Responsável" 
									style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.card }]}
									value={professor} onChangeText={setProfessor}
									placeholderTextColor={colors.textMuted}
								/>
								<TextInput 
									placeholder="Local (Ex: Lab 4)" 
									style={[styles.input, { color: colors.textMain, borderColor: colors.border, backgroundColor: colors.card }]}
									value={local} onChangeText={setLocal}
									placeholderTextColor={colors.textMuted}
								/>

								<Text style={[styles.miniTitle, { color: colors.textMain }]}>Vincular Horários</Text>
								
								<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
									{DIAS_SEMANA.map(dia => (
										<TouchableOpacity 
											key={dia.value} 
											onPress={() => setDiaSelecionado(dia.value)}
											style={[styles.dayChip, { borderColor: colors.border }, diaSelecionado === dia.value && { backgroundColor: colors.primary }]}
										>
											<Text style={{ color: diaSelecionado === dia.value ? '#FFF' : colors.textMain, fontSize: 12 }}>{dia.label}</Text>
										</TouchableOpacity>
									))}
								</ScrollView>

								<View style={styles.timeRow}>
									<TouchableOpacity style={[styles.timeBtn, { borderColor: colors.border }]} onPress={() => setShowPicker('inicio')}>
										<Clock size={16} color={colors.primary} />
										<Text style={{ color: colors.textMain }}>{formatTime(horaInicio)}</Text>
									</TouchableOpacity>
									<Text style={{ color: colors.textMuted }}>até</Text>
									<TouchableOpacity style={[styles.timeBtn, { borderColor: colors.border }]} onPress={() => setShowPicker('fim')}>
										<Clock size={16} color={colors.primary} />
										<Text style={{ color: colors.textMain }}>{formatTime(horaFim)}</Text>
									</TouchableOpacity>
									<TouchableOpacity style={styles.addTimeBtn} onPress={adicionarHorario}>
										<Plus size={20} color="#FFF" />
									</TouchableOpacity>
								</View>

								{showPicker && (
									<DateTimePicker
										value={showPicker === 'inicio' ? horaInicio : horaFim}
										mode="time" is24Hour={true}
										onChange={(e, date) => {
											setShowPicker(null);
											if (date) showPicker === 'inicio' ? setHoraInicio(date) : setHoraFim(date);
										}}
									/>
								)}

								{horariosTemporarios.map((h, i) => (
									<View key={i} style={styles.tempHorario}>
										<Text style={{ color: colors.textMain, fontWeight: '600' }}>
											{h.dia_label}: {h.hora_inicio} - {h.hora_fim}
										</Text>
										<TouchableOpacity onPress={() => setHorariosTemporarios(horariosTemporarios.filter((_, idx) => idx !== i))}>
											<Trash2 size={16} color={colors.danger} />
										</TouchableOpacity>
									</View>
								))}

								<TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
									<CheckCircle2 size={20} color="#FFF" />
									<Text style={styles.saveBtnText}>CADASTRAR DISCIPLINA</Text>
								</TouchableOpacity>
								<View style={{ height: 50 }} />
							</ScrollView>
						</SafeAreaView>
					</View>
				</Modal>
			</View>
		</SafeAreaProvider>
	);
}

const createStyles = (colors: any, isDark: boolean) =>
	StyleSheet.create({
		container: { flex: 1, backgroundColor: colors.background },
		safeHeader: { backgroundColor: colors.background },
		header: { paddingHorizontal: 24, paddingVertical: 10 },
		greetingText: { fontSize: 28, fontWeight: "800", color: colors.textMain, letterSpacing: -0.5 },
		dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
		dateText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
		scrollContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 140 },
		featuredSection: { marginBottom: 32 },
		mainCard: {
			backgroundColor: colors.primary, borderRadius: 30, padding: 26,
			shadowColor: colors.primary, shadowOffset: { width: 0, height: 12 },
			shadowOpacity: isDark ? 0.4 : 0.22, shadowRadius: 18, elevation: 8,
		},
		mainTitle: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
		mainSubtitle: { fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 22, marginBottom: 25 },
		statsRow: { flexDirection: "row", alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 20 },
		statItem: { flex: 1, alignItems: "center" },
		statValue: { color: "#FFF", fontSize: 24, fontWeight: "800" },
		statLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "700", textTransform: "uppercase" },
		sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
		sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.textMain },
		addBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.softGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
		addText: { fontSize: 11, fontWeight: "900", color: colors.primary },
		subjectListItem: {
			flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
			padding: 20, borderRadius: 24, marginBottom: 12, borderWidth: 1, borderColor: colors.border
		},
		subjectName: { fontSize: 16, fontWeight: '700', color: colors.textMain },
		subjectProf: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
		subjectHours: { fontSize: 11, color: colors.accent, fontWeight: '700', marginTop: 4 },
		placeholderCard: {
			flexDirection: "row", alignItems: "center", padding: 24, backgroundColor: colors.card,
			borderRadius: 24, gap: 18, borderWidth: 1, borderColor: colors.border, borderStyle: "dashed", marginBottom: 20,
		},
		placeholderInfo: { flex: 1 },
		placeholderTitle: { fontSize: 16, fontWeight: "700", color: colors.textMain },
		placeholderSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
		infoCard: { flexDirection: "row", padding: 16, borderRadius: 16, gap: 12, alignItems: "center" },
		infoText: { flex: 1, fontSize: 13, fontWeight: "600", lineHeight: 18 },
		modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
		modalContent: { borderTopLeftRadius: 30, borderTopRightRadius: 30, height: '90%' },
		modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
		modalTitle: { fontSize: 20, fontWeight: '800' },
		input: { borderWidth: 1, borderRadius: 15, padding: 15, marginBottom: 12, fontSize: 16 },
		miniTitle: { fontSize: 14, fontWeight: '800', marginTop: 10, marginBottom: 12, textTransform: 'uppercase' },
		dayChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginRight: 8 },
		timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
		timeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderRadius: 12, justifyContent: 'center' },
		addTimeBtn: { backgroundColor: colors.accent, width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
		tempHorario: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 12, marginBottom: 8 },
		saveBtn: { backgroundColor: colors.primary, flexDirection: 'row', padding: 18, borderRadius: 20, justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
		saveBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 }
	});