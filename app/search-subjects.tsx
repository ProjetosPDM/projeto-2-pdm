import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Check, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { Subject } from '@/types/Subject';
import { useSubjects } from '@/context/SubjectContext';

const ALL_SUBJECTS: Subject[] = [
  { id: '1', name: 'Programação de Dispositivos Móveis', prof: 'Luiz Onofre', schedule: 'Segunda-feira', timeStart: '08:00', timeEnd: '09:40', location: 'Lab 4' },
  { id: '2', name: 'Banco de Dados I', prof: 'Fabio Gomes', schedule: 'Terça-feira', timeStart: '10:00', timeEnd: '11:40', location: 'Lab 2' },
  { id: '3', name: 'Redes de Computadores', prof: 'Gustavo Wagner', schedule: 'Quarta-feira', timeStart: '08:00', timeEnd: '09:40', location: 'Lab 3' },
  { id: '4', name: 'Inteligência Artificial', prof: 'Cândido Egídio', schedule: 'Quinta-feira', timeStart: '13:00', timeEnd: '14:40', location: 'Sala 15' },
  { id: '5', name: 'Sistemas Operacionais', prof: 'Erick de Melo', schedule: 'Sexta-feira', timeStart: '10:00', timeEnd: '11:40', location: 'Lab 1' },
];

export default function SearchSubjects() {
  const router = useRouter();
  const { addSubjects } = useSubjects(); 

  const { colors } = useTheme();
  
  const [searchText, setSearchText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredSubjects = ALL_SUBJECTS.filter(s => 
    s.name.toLowerCase().includes(searchText.toLowerCase()) ||
    s.prof.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = () => {
    const subjectsToAdd = ALL_SUBJECTS.filter(s => selectedIds.includes(s.id));
    addSubjects(subjectsToAdd); 
    router.back();
  };

  const styles = createStyles(colors);

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
        {searchText !== '' && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <X size={20} color={colors.textMuted} />
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
                <Text style={styles.subjectDetails}>{item.prof} • {item.schedule} {item.timeStart}</Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                {isSelected && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {selectedIds.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm} 
          >
            <Text style={styles.confirmText}>
              Adicionar {selectedIds.length} {selectedIds.length === 1 ? 'Disciplina' : 'Disciplinas'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  backButton: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: '800', color: colors.textMain },
  
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
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
  input: { flex: 1, fontSize: 16, color: colors.textMain, fontWeight: '500' },
  
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  subjectCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.card,
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  selectedCard: { borderColor: colors.accent, backgroundColor: colors.softGreen },
  info: { flex: 1 },
  subjectName: { fontSize: 15, fontWeight: '700', color: colors.textMain, marginBottom: 4 },
  subjectDetails: { fontSize: 13, color: colors.textMuted },
  
  checkbox: { width: 24, height: 24, borderRadius: 8, borderWidth: 2, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.accent, borderColor: colors.accent },

  footer: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  confirmButton: { backgroundColor: colors.primary, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  confirmText: { color: "#FFFFFF", fontSize: 16, fontWeight: '800' }
});