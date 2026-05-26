import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, Check, ArrowLeft, WifiOff } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../context/ThemeContext";
import { Subject } from "@/types/Subject";
import { useSubjects } from "@/context/SubjectContext";
import { verificaChoqueHorario } from "@/utils/date";
import { ConflictModal } from "@/components/ConflictModal";

import { supabase } from "@/utils/supabase";
import { useAuth } from "@/context/AuthContext";

export default function SearchSubjects() {
  const router = useRouter();
  const { addSubjects, removeSubjectGroup, mySubjects } = useSubjects();
  const { colors, isDark } = useTheme();
  const { session } = useAuth();

  const [dbSubjects, setDbSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  
  const cloudInitialIdsRef = useRef<string[]>([]);

  const [conflictData, setConflictData] = useState<any>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setIsOffline(false);

      const { data: disciplinasData, error: errorDisc } = await supabase
        .from('disciplinas')
        .select(`
          id, nome, professor, local,
          horarios_disciplina ( id, dia_semana, hora_inicio, hora_fim )
        `);

      if (errorDisc) throw errorDisc;

      const { data: cloudData, error: errorCloud } = await supabase
        .from('aluno_disciplinas')
        .select('disciplina_id')
        .eq('aluno_id', session?.user?.id);

      if (errorCloud) throw errorCloud;

      const formattedData = disciplinasData.map((d: any) => ({
        id: d.id,
        name: d.nome,
        prof: d.professor,
        classes: d.horarios_disciplina.map((h: any) => ({
          id: h.id,
          schedule: h.dia_semana,
          timeStart: h.hora_inicio.substring(0, 5),
          timeEnd: h.hora_fim.substring(0, 5),
          location: d.local,
        }))
      }));

      setDbSubjects(formattedData);
      cloudInitialIdsRef.current = cloudData.map((m: any) => m.disciplina_id);

      const idsLocalmenteAtivos = Array.from(
        new Set(mySubjects.filter(s => s.subjectId).map((s) => s.subjectId))
      );
      
      const idsConsolidados = Array.from(new Set([...cloudInitialIdsRef.current, ...idsLocalmenteAtivos]));
      setSelectedIds(idsConsolidados);

    } catch (error) {
      console.error("Erro na busca da API:", error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = dbSubjects.filter(
    (s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.prof.toLowerCase().includes(searchText.toLowerCase()),
  );

  const toggleSelect = (idSelecionado: string) => {
    if (selectedIds.includes(idSelecionado)) {
      setSelectedIds(selectedIds.filter((item) => item !== idSelecionado));
      return;
    }

    const disciplinaDesejada = dbSubjects.find(d => d.id === idSelecionado);
    const disciplinasJaMarcadas = dbSubjects.filter(d => selectedIds.includes(d.id));
    const aulasJaMarcadas = disciplinasJaMarcadas.flatMap(d => d.classes.map((c: any) => ({...c, nomeDisciplina: d.name})));

    if (disciplinaDesejada) {
      for (const aulaNova of disciplinaDesejada.classes) {
        const choque = verificaChoqueHorario(aulaNova, aulasJaMarcadas);

        if (choque) {
          setConflictData({
            newSubject: disciplinaDesejada.name,
            conflictingSubject: choque.nomeDisciplina,
            schedule: aulaNova.schedule,
            timeStart: aulaNova.timeStart,
            timeEnd: aulaNova.timeEnd
          });
          setShowConflictModal(true);
          return;
        }
      }
    }

    setSelectedIds([...selectedIds, idSelecionado]);
  };

  const handleConfirm = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);

    try {
      const cloudIds = cloudInitialIdsRef.current;
      
      const toAddIds = selectedIds.filter(id => !cloudIds.includes(id));
      const toRemoveIds = cloudIds.filter(id => !selectedIds.includes(id));

      if (toRemoveIds.length > 0) {
        await supabase
          .from('aluno_disciplinas')
          .delete()
          .eq('aluno_id', session.user.id)
          .in('disciplina_id', toRemoveIds);
      }

      if (toAddIds.length > 0) {
        const inserts = toAddIds.map(dId => ({
          aluno_id: session.user.id,
          disciplina_id: dId
        }));
        await supabase.from('aluno_disciplinas').insert(inserts);
      }

      const toAddGrouped = dbSubjects.filter(s => toAddIds.includes(s.id));
      const toAddFlat: Subject[] = toAddGrouped.flatMap(subject => 
        subject.classes.map((aula: any) => ({
          id: aula.id,
          subjectId: subject.id,
          name: subject.name,
          prof: subject.prof,
          schedule: aula.schedule,
          timeStart: aula.timeStart,
          timeEnd: aula.timeEnd,
          location: aula.location
        }))
      );

      if (toAddFlat.length > 0) {
        await addSubjects(toAddFlat);
      }

      const idsLocalmentePresentes = Array.from(new Set(mySubjects.filter(s => s.subjectId).map((s) => s.subjectId)));
      const toRemoveLocal = idsLocalmentePresentes.filter(id => !selectedIds.includes(id));

      for (const subjectId of toRemoveLocal) {
        if (subjectId) {
          await removeSubjectGroup(subjectId);
        }
      }

      router.back();

    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações. Verifique sua conexão.");
      setIsSaving(false);
    }
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecionar Disciplinas</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquise por nome ou professor..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={colors.textMuted}
        />
        {searchText !== "" && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.statusText, { color: colors.textMuted }]}>Buscando disciplinas...</Text>
        </View>
      ) : isOffline ? (
        <View style={styles.centerContainer}>
          <WifiOff size={48} color={colors.danger} opacity={0.8} />
          <Text style={[styles.statusText, { color: colors.textMain, fontWeight: '700', marginTop: 12 }]}>Você está offline</Text>
          <Text style={[styles.statusText, { color: colors.textMuted, textAlign: 'center', marginHorizontal: 30 }]}>Não foi possível carregar o catálogo de disciplinas.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredSubjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);
            const diasDaSemana = item.classes.map((c: any) => c.schedule.split('-')[0]).join(' e ');

            return (
              <TouchableOpacity
                style={[styles.subjectCard, isSelected && styles.selectedCard]}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.info}>
                  <Text style={styles.subjectName}>{item.name}</Text>
                  <Text style={styles.subjectDetails}>{item.prof} • {diasDaSemana}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      {!isLoading && !isOffline && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={isSaving}
          >
            <Text style={styles.confirmText}>
              {isSaving ? 'Sincronizando...' : `Confirmar Alterações (${selectedIds.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {conflictData && (
        <ConflictModal
          visible={showConflictModal}
          onClose={() => setShowConflictModal(false)}
          newSubject={conflictData.newSubject}
          conflictingSubject={conflictData.conflictingSubject}
          schedule={conflictData.schedule}
          timeStart={conflictData.timeStart}
          timeEnd={conflictData.timeEnd}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16
    },
    backButton: { marginRight: 16 },
    title: { 
      fontSize: 20, 
      fontWeight: "800", 
      color: colors.textMain
    },
    searchContainer: { 
      flexDirection: "row", 
      alignItems: "center", 
      backgroundColor: colors.card, 
      marginHorizontal: 24, 
      paddingHorizontal: 16, 
      height: 56, 
      borderRadius: 16, 
      borderWidth: 1, 
      borderColor: colors.border,
      marginBottom: 20
    },
    searchIcon: { marginRight: 12 },
    input: {
      flex: 1,
      fontSize: 16,
      color: colors.textMain,
      fontWeight: "500"
    },
    list: { paddingHorizontal: 24, paddingBottom: 100 },
    subjectCard: { 
      flexDirection: "row", 
      alignItems: "center", 
      backgroundColor: colors.card, 
      padding: 16, 
      borderRadius: 20, 
      marginBottom: 12, 
      borderWidth: 1, 
      borderColor: "transparent"
    },
    selectedCard: { 
      borderColor: colors.accent, 
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.05)' : colors.softGreen
    },
    info: { flex: 1 },
    subjectName: { 
      fontSize: 15, 
      fontWeight: "700", 
      color: colors.textMain, 
      marginBottom: 4
    
    },
    subjectDetails: { fontSize: 13, color: colors.textMuted },
    checkbox: { 
      width: 24, 
      height: 24, 
      borderRadius: 8, 
      borderWidth: 2, 
      borderColor: colors.border, 
      justifyContent: "center", 
      alignItems: "center"
    },
    checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },
    footer: { position: "absolute", bottom: 40, left: 24, right: 24 },
    confirmButton: { 
      backgroundColor: colors.primary, 
      height: 60, 
      borderRadius: 20, 
      justifyContent: "center", 
      alignItems: "center", 
      elevation: 8
    },
    confirmText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
    statusText: { marginTop: 16, fontSize: 15 },
    retryButton: { marginTop: 24, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    retryText: { color: "#FFFFFF", fontWeight: '700', fontSize: 15 }
  });