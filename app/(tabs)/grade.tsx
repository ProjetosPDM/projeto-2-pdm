import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: "#064E3B", background: "#F8FAFB", white: "#FFFFFF",
  textMain: "#1A202C", textMuted: "#718096", border: "#EDF2F7",
};

export default function GradeScreen() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <Text style={styles.title}>Grade Horária</Text>
            <Text style={styles.subtitle}>Semestre 2026.1</Text>
          </View>
        </SafeAreaView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.daySection}>
            <Text style={styles.dayTitle}>Segunda-feira</Text>
            
            <View style={styles.scheduleCard}>
              <View style={styles.timeTag}>
                <Text style={styles.timeStart}>08:00</Text>
                <Text style={styles.timeEnd}>09:40</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.subjectText}>Desenvolvimento Web II</Text>
                <Text style={styles.profText}>Anderson Silva • Lab 4</Text>
              </View>
            </View>

            <View style={styles.scheduleCard}>
              <View style={styles.timeTag}>
                <Text style={styles.timeStart}>10:00</Text>
                <Text style={styles.timeEnd}>11:40</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.subjectText}>Estrutura de Dados</Text>
                <Text style={styles.profText}>Maria Oliveira • Lab 2</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeHeader: { backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingVertical: 10, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.textMain, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: COLORS.textMuted, marginTop: 4 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 140 },
  
  daySection: { marginBottom: 30 },
  dayTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 16 },
  
  scheduleCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 18, flexDirection: "row", alignItems: "center", marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  timeTag: { alignItems: "center", paddingRight: 18, borderRightWidth: 1, borderRightColor: COLORS.border, width: 65 },
  timeStart: { fontSize: 15, fontWeight: "800", color: COLORS.textMain },
  timeEnd: { fontSize: 11, color: COLORS.textMuted, fontWeight: "700" },
  cardInfo: { flex: 1, paddingLeft: 18 },
  subjectText: { fontSize: 16, fontWeight: "700", color: COLORS.textMain, marginBottom: 2 },
  profText: { fontSize: 13, color: COLORS.textMuted, fontWeight: "500" },
});