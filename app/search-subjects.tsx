// app/search-subjects.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Check, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: "#064E3B", background: "#F8FAFB", white: "#FFFFFF",
  textMain: "#1A202C", textMuted: "#718096", border: "#EDF2F7", accent: "#10B981"
};

// MOCK de dados (Isso virá do Admin/Banco depois)
const ALL_SUBJECTS = [
  { id: '1', name: 'Programação de Dispositivos Móveis', prof: 'Luiz Onofre', schedule: 'Seg 08:00' },
  { id: '2', name: 'Banco de Dados I', prof: 'Fabio Gomes', schedule: 'Ter 10:00' },
  { id: '3', name: 'Redes de Computadores', prof: 'Gustavo Wagner', schedule: 'Qua 08:00' },
  { id: '4', name: 'Inteligência Artificial', prof: 'Cândido Egídio', schedule: 'Qui 13:00' },
  { id: '5', name: 'Sistemas Operacionais', prof: 'Erick de Melo', schedule: 'Sex 10:00' },
];

export default function SearchSubjects() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filtra as disciplinas com base no que o aluno digita
  const filteredSubjects = ALL_SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={COLORS.textMain} />
        </TouchableOpacity>
        <Text style={styles.title}>Selecionar Disciplinas</Text>
      </View>

      {/* BARRA DE PESQUISA */}
      <View style={styles.searchContainer}>
        <Search size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pesquise por nome ou professor..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={COLORS.textMuted}
        />
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <X size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredSubjects}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity 
              style={[styles.subjectCard, isSelected && styles.selectedCard]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.info}>
                <Text style={styles.subjectName}>{item.name}</Text>
                <Text style={styles.subjectDetails}>{item.prof} • {item.schedule}</Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                {isSelected && <Check size={16} color={COLORS.white} strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* BOTÃO DE CONFIRMAR */}
      {selectedIds.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={() => router.back()} // No futuro, isso salva no SQLite
          >
            <Text style={styles.confirmText}>Adicionar {selectedIds.length} Disciplinas</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: '800', color: COLORS.textMain },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    marginHorizontal: 24, 
    paddingHorizontal: 16, 
    height: 56, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20
  },
  searchIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: COLORS.textMain, fontWeight: '500' },
  
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  subjectCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COLORS.white, 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedCard: { borderColor: COLORS.accent, backgroundColor: COLORS.softGreen },
  info: { flex: 1 },
  subjectName: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, marginBottom: 4 },
  subjectDetails: { fontSize: 13, color: COLORS.textMuted },
  
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },

  footer: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  confirmButton: { backgroundColor: COLORS.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  confirmText: { color: COLORS.white, fontSize: 16, fontWeight: '800' }
});