import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Plus, BookOpen, Clock, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";

import { EmptyState } from "@/components/EmptyState";
import { useSubjects } from "../../context/SubjectContext";

import { useTheme } from "../../context/ThemeContext";

export default function GradeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { mySubjects, removeSubject } = useSubjects();

  const confirmarRemocao = (id: string, nome: string) => {
    Alert.alert(
      "Remover Disciplina",
      `Tem certeza que deseja remover "${nome}" da sua grade?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeSubject(id),
        },
      ],
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Ajusta a barra de status conforme o tema */}
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
              {mySubjects.map((item) => (
                <View key={item.id} style={styles.scheduleCard}>
                  <View style={styles.timeTag}>
                    <Text style={styles.timeStart}>{item.timeStart}</Text>
                    <Text style={styles.timeEnd}>{item.timeEnd}</Text>
                  </View>

                  <View style={styles.cardInfo}>
                    <Text style={styles.subjectText} numberOfLines={1}>
                      {item.name}
                    </Text>

                    <View style={styles.detailsRow}>
                      <Text style={styles.profText}>{item.prof}</Text>
                      <View style={styles.dot} />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>

                    <View style={styles.dayTag}>
                      <Clock
                        size={12}
                        color={colors.accent}
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.dayText}>{item.schedule}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => confirmarRemocao(item.id, item.name)}
                    activeOpacity={0.6}
                  >
                    <Trash2 size={20} color={colors.danger} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
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
  scheduleCard: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
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
  timeStart: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.textMain,
  },
  timeEnd: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 18,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  profText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.textMuted,
    marginHorizontal: 6,
  },
  locationText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: "500",
  },
  dayTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.softGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  dayText: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: "700",
  },
  deleteButton: {
    padding: 8,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});