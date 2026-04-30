import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Pencil, 
  Check 
} from 'lucide-react-native';

// Importando o contexto para gerenciar o nome real
import { useSubjects } from '../../context/SubjectContext';

const COLORS = {
  primary: "#064E3B", background: "#F8FAFB", white: "#FFFFFF",
  textMain: "#1A202C", textMuted: "#718096", border: "#EDF2F7",
  softGreen: "#F0FDF4", danger: "#EF4444", dangerLight: "#FEF2F2",
  accent: "#10B981"
};

export default function PerfilScreen() {
  const { userName, updateUserName } = useSubjects();
  const [estaEditando, setEstaEditando] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(userName);
  
  const isApproved = true; 

  const handleSalvarNome = async () => {
    if (nomeTemp.trim().length < 3) {
      Alert.alert("Erro", "O nome deve ter pelo menos 3 caracteres.");
      return;
    }
    await updateUserName(nomeTemp);
    setEstaEditando(false);
  };

  const cancelarEdicao = () => {
    setNomeTemp(userName);
    setEstaEditando(false);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <Text style={styles.title}>Meu Perfil</Text>
          </View>
        </SafeAreaView>

        <View style={styles.content}>
          <View style={styles.profileCard}>
            {/* Avatar dinâmico com a primeira letra do nome */}
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            {/* Área do Nome Editável */}
            <View style={styles.nameContainer}>
              {estaEditando ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.input}
                    value={nomeTemp}
                    onChangeText={setNomeTemp}
                    autoFocus
                    placeholder="Seu nome"
                  />
                  <TouchableOpacity onPress={handleSalvarNome} style={styles.saveBtn}>
                    <Check size={20} color={COLORS.white} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.nameRow} 
                  onPress={() => {
                    setNomeTemp(userName);
                    setEstaEditando(true);
                  }}
                >
                  <Text style={styles.name}>{userName}</Text>
                  <Pencil size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.registration}>Matrícula: 2024100123</Text>
            
            <View style={[styles.statusBadge, isApproved ? styles.statusApproved : styles.statusPending]}>
              {isApproved ? <CheckCircle2 size={14} color={COLORS.primary} /> : <Clock size={14} color="#B45309" />}
              <Text style={[styles.statusText, isApproved ? styles.statusTextApproved : styles.statusTextPending]}>
                {isApproved ? 'Conta Aprovada' : 'Aprovação Pendente'}
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <RefreshCw size={20} color={COLORS.textMain} />
              </View>
              <Text style={styles.actionText}>Sincronizar Grade (Offline)</Text>
              <ChevronRight size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <Settings size={20} color={COLORS.textMain} />
              </View>
              <Text style={styles.actionText}>Configurações</Text>
              <ChevronRight size={20} color={COLORS.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, { marginTop: 12 }]} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.dangerLight }]}>
                <LogOut size={20} color={COLORS.danger} />
              </View>
              <Text style={[styles.actionText, { color: COLORS.danger }]}>Sair do Aplicativo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safeHeader: { backgroundColor: COLORS.background },
  header: { paddingHorizontal: 24, paddingVertical: 10, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "800", color: COLORS.textMain, letterSpacing: -0.5 },
  content: { paddingHorizontal: 24, flex: 1 },
  
  profileCard: { alignItems: 'center', backgroundColor: COLORS.white, padding: 24, borderRadius: 30, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 5, marginBottom: 32, borderWidth: 1, borderColor: COLORS.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '800', color: COLORS.white },
  
  // Estilos da Edição de Nome
  nameContainer: { marginBottom: 4, width: '100%', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.textMain },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '90%' },
  input: { flex: 1, fontSize: 20, fontWeight: '700', color: COLORS.textMain, borderBottomWidth: 2, borderBottomColor: COLORS.accent, paddingVertical: 2 },
  saveBtn: { backgroundColor: COLORS.accent, width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  registration: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500', marginBottom: 16 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  statusApproved: { backgroundColor: COLORS.softGreen },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 13, fontWeight: '700' },
  statusTextApproved: { color: COLORS.primary },
  statusTextPending: { color: '#B45309' },

  actionsContainer: { gap: 12 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  actionIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionText: { fontSize: 15, fontWeight: '700', color: COLORS.textMain, flex: 1 },
});