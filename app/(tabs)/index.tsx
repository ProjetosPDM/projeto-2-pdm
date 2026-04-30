import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  MapPin,
  Clock,
  ChevronRight,
  CheckCircle2,
  Calendar,
  BookOpen,
} from "lucide-react-native";

import { useSubjects } from "../../context/SubjectContext";
import {
  getFormattedDate,
  getToday,
  timeToMinutes,
  calculateProgress,
} from "@/utils/date";

const COLORS = {
  primary: "#064E3B",
  accent: "#10B981",
  background: "#F8FAFB",
  white: "#FFFFFF",
  textMain: "#1A202C",
  textMuted: "#718096",
  border: "#EDF2F7",
  tagBg: "#F1F5F9",
  softGreen: "#F0FDF4",
};

export default function HomeScreen() {
  const { mySubjects } = useSubjects();
  const currentDate = getFormattedDate();

  const { aulaAtual, proximasAulas, aulasEncerradas } = useMemo(() => {
    const hoje = getToday();
    const agoraEmMinutos = new Date().getHours() * 60 + new Date().getMinutes();

    const aulasDeHoje = mySubjects
      .filter((s) => s.schedule === hoje)
      .sort((a, b) => timeToMinutes(a.timeStart) - timeToMinutes(b.timeStart));

    return {
      aulaAtual: aulasDeHoje.find(
        (s) =>
          agoraEmMinutos >= timeToMinutes(s.timeStart) &&
          agoraEmMinutos <= timeToMinutes(s.timeEnd)
      ),
      proximasAulas: aulasDeHoje.filter(
        (s) => agoraEmMinutos < timeToMinutes(s.timeStart)
      ),
      aulasEncerradas: aulasDeHoje.filter(
        (s) => agoraEmMinutos > timeToMinutes(s.timeEnd)
      ),
    };
  }, [mySubjects]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />

        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingText}>Olá, Dário</Text>
              <View style={styles.dateRow}>
                <Calendar size={14} color={COLORS.textMuted} />
                <Text style={styles.dateText}>{currentDate}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {aulaAtual ? (
            <View style={styles.featuredSection}>
              <View style={styles.liveBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.liveText}>AULA AGORA</Text>
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
                          width: `${calculateProgress(
                            aulaAtual.timeStart,
                            aulaAtual.timeEnd
                          )}%`,
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
          ) : null}

          {mySubjects.filter((s) => s.schedule === getToday()).length === 0 && (
            <View style={styles.noClassesToday}>
              <BookOpen size={40} color={COLORS.border} />
              <Text style={styles.noClassesText}>Sem aulas para hoje.</Text>
            </View>
          )}

          {proximasAulas.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Próximas do dia</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>
                    {proximasAulas.length} restantes
                  </Text>
                </View>
              </View>

              {proximasAulas.map((aula) => (
                <TouchableOpacity
                  key={aula.id}
                  activeOpacity={0.8}
                  style={styles.scheduleCard}
                >
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
                  <ChevronRight
                    size={18}
                    color={COLORS.textMuted}
                    strokeWidth={1.5}
                  />
                </TouchableOpacity>
              ))}
            </>
          )}

          {aulasEncerradas.length > 0 && (
            <>
              <Text
                style={[styles.sectionTitle, { marginTop: 32, marginBottom: 16 }]}
              >
                Encerradas
              </Text>

              {aulasEncerradas.map((aula) => (
                <View key={aula.id} style={styles.pastCard}>
                  <CheckCircle2 size={20} color={COLORS.accent} />
                  <View style={styles.pastInfo}>
                    <Text style={styles.pastTitle}>{aula.name}</Text>
                    <Text style={styles.pastSub}>
                      Finalizada às {aula.timeEnd}
                    </Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeHeader: { backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingVertical: 10 },
  greetingText: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textMain,
    letterSpacing: -0.5,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  dateText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "600" },
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
    backgroundColor: COLORS.accent,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.accent,
    letterSpacing: 1,
  },
  mainCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    padding: 26,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 8,
  },
  mainSubject: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
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
  progressPercent: { fontSize: 11, color: COLORS.white, fontWeight: "800" },
  progressTrack: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.accent,
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
  footerValue: { color: COLORS.white, fontSize: 13, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textMain },
  countBadge: {
    backgroundColor: COLORS.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: { fontSize: 11, fontWeight: "800", color: COLORS.textMuted },
  scheduleCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timeTag: {
    alignItems: "center",
    paddingRight: 18,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    width: 65,
  },
  timeStart: { fontSize: 15, fontWeight: "800", color: COLORS.textMain },
  timeEnd: { fontSize: 11, color: COLORS.textMuted, fontWeight: "700" },
  cardInfo: { flex: 1, paddingLeft: 18 },
  subjectText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textMain,
    marginBottom: 2,
  },
  profText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "500" },
  pastCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "rgba(226, 232, 240, 0.3)",
    borderRadius: 20,
    gap: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    marginBottom: 12,
  },
  pastInfo: { flex: 1 },
  pastTitle: { fontSize: 15, fontWeight: "700", color: COLORS.textMuted },
  pastSub: { fontSize: 13, color: COLORS.textMuted },
  noClassesToday: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    gap: 10,
  },
  noClassesText: { color: COLORS.textMuted, fontWeight: "600" },
});