import { useRouter } from "expo-router";
import { BookOpen, Plus } from "lucide-react-native";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/EmptyState";
import { ScheduleCard } from "@/components/ScheduleCard";
import { useSubjects } from "../../context/SubjectContext";
import { useTheme } from "../../context/ThemeContext";

export default function GradeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { mySubjects, removeSubjectGroup } = useSubjects();
  const confirmarRemocao = (subjectId: string, nome: string) => {
    Alert.alert(
      "Remover Disciplina",
      `Tem certeza que deseja remover "${nome}" e todos os seus horários da grade?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeSubjectGroup(subjectId), 
        },
      ],
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Minha Grade</Text>
              <Text style={styles.subtitle}>Gerencie suas disciplinas</Text>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/search-subjects")}
            >
              <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {mySubjects.length === 0 ? (
            <View style={{ flex: 1, marginTop: 40 }}>
              <EmptyState
                icon={BookOpen}
                title="Nenhuma disciplina adicionada"
                description="Clique no botão + para montar sua grade."
                actionLabel="Adicionar disciplina"
                onActionPressed={() => router.push("/search-subjects")}
              />
            </View>
          ) : (
            <View style={styles.listContainer}>
              {mySubjects.map((subject) => (
                <ScheduleCard
                  key={subject.id}
                  subject={subject}
                  onDelete={() => confirmarRemocao(subject.subjectId, subject.name)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeHeader: { backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  title: { fontSize: 28, fontWeight: "800", color: colors.textMain },
  subtitle: { fontSize: 15, color: colors.textMuted },
  addButton: {
    backgroundColor: colors.primary,
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 140,
  },
  listContainer: {
    gap: 12,
  },
});