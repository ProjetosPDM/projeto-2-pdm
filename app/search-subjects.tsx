import React, { useState, useEffect, useRef} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, Check, ArrowLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

import { useTheme } from "../context/ThemeContext";
import { Subject } from "@/types/Subject";
import { useSubjects } from "@/context/SubjectContext";

import { MOCK_DISCIPLINAS } from "@/data/mockDisciplinas";
import { verificaChoqueHorario } from "@/utils/date";
import {ConflictModal} from "@/components/ConflictModal";

export default function SearchSubjects() {
  const router = useRouter();
  const { addSubjects, removeSubjectGroup, mySubjects } = useSubjects();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const [conflictData, setConflictData] = useState<any>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  useEffect(() => {
    if (!isSavingRef.current) {
      const initialSelected = Array.from(new Set(mySubjects.map((s) => s.id.replace(/[a-z]/g, ''))));
      setSelectedIds(initialSelected);
    }
  }, [mySubjects]);

  const filteredSubjects = MOCK_DISCIPLINAS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.prof.toLowerCase().includes(searchText.toLowerCase()),
  );

  const toggleSelect = (idSelecionado: string) => {
    if (selectedIds.includes(idSelecionado)) {
      setSelectedIds(selectedIds.filter((item) => item !== idSelecionado));
      return;
    }

    const disciplinaDesejada = MOCK_DISCIPLINAS.find(d => d.id === idSelecionado);
    
    const disciplinasJaMarcadas = MOCK_DISCIPLINAS.filter(d => selectedIds.includes(d.id));
    const aulasJaMarcadas = disciplinasJaMarcadas.flatMap(d => d.classes.map(c => ({...c, nomeDisciplina: d.name})));

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
    isSavingRef.current = true;
    setIsSaving(true);

    const initialIds = Array.from(new Set(mySubjects.map((s) => s.id.replace(/[a-z]/g, ''))));

    const toAddGrouped = MOCK_DISCIPLINAS.filter(
      (s) => selectedIds.includes(s.id) && !initialIds.includes(s.id),
    );

    const toRemoveIds = initialIds.filter((id) => !selectedIds.includes(id));

    const toAddFlat: Subject[] = toAddGrouped.flatMap(subject => 
      subject.classes.map(aula => ({
        id: aula.id,
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

    for (const subjectId of toRemoveIds) {
      await removeSubjectGroup(subjectId);
    }

    router.back();
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
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

      <FlatList
        data={filteredSubjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          
          const diasDaSemana = item.classes
            .map(c => c.schedule.split('-')[0]) 
            .join(' e ');

          return (
            <TouchableOpacity
              style={[styles.subjectCard, isSelected && styles.selectedCard]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.info}>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectDetails}>
                  {item.prof} • {diasDaSemana}
                </Text>
              </View>
              <View
                style={[styles.checkbox, isSelected && styles.checkboxActive]}
              >
                {isSelected && (
                  <Check size={16} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          disabled={isSaving}
        >
          <Text style={styles.confirmText}>
            {isSaving ? 'Salvando alterações...' : `Confirmar Alterações (${selectedIds.length})`}
          </Text>
        </TouchableOpacity>
      </View>

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

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    backButton: { marginRight: 16 },
    title: { fontSize: 20, fontWeight: "800", color: colors.textMain },

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
      marginBottom: 20,
    },
    searchIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: colors.textMain, fontWeight: "500" },

    list: { paddingHorizontal: 24, paddingBottom: 100 },
    subjectCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 20,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "transparent",
    },
    selectedCard: {
      borderColor: colors.accent,
      backgroundColor: colors.softGreen,
    },
    info: { flex: 1 },
    subjectName: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.textMain,
      marginBottom: 4,
    },
    subjectDetails: { fontSize: 13, color: colors.textMuted },

    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },

    footer: { position: "absolute", bottom: 40, left: 24, right: 24 },
    confirmButton: {
      backgroundColor: colors.primary,
      height: 60,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
    },
    confirmText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  });
