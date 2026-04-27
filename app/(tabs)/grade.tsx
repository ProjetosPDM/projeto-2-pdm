import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Plus, BookOpen } from 'lucide-react-native';
import { useRouter } from 'expo-router'; 

const COLORS = {
  primary: "#064E3B", background: "#F8FAFB", white: "#FFFFFF",
  textMain: "#1A202C", textMuted: "#718096", border: "#EDF2F7",
};

export default function GradeScreen() {
  const router = useRouter(); 

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Minha Grade</Text>
              <Text style={styles.subtitle}>Gerencie suas disciplinas</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push('/search-subjects')} 
            >
              <Plus size={24} color={COLORS.white} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyState}>
            <BookOpen size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>Nenhuma disciplina adicionada ainda.</Text>
            <Text style={styles.emptySubText}>Clique no + para montar sua grade.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeHeader: { backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 10 
  },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.textMain },
  subtitle: { fontSize: 15, color: COLORS.textMuted },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 140 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, fontWeight: '700', color: COLORS.textMuted, marginTop: 16 },
  emptySubText: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
});