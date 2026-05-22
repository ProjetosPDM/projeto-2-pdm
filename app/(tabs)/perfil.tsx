import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  StatusBar, 
  BackHandler, 
  Platform,
  Modal,
  Pressable
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { 
  Settings, 
  RefreshCw, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Pencil, 
  Check,
  Sun,
  Moon,
  Smartphone
} from 'lucide-react-native';

import { useSubjects } from '../../context/SubjectContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme(); 
  const { userName, updateUserName } = useSubjects();
  const { signOut } = useAuth();

  const [estaEditando, setEstaEditando] = useState(false);
  const [nomeTemp, setNomeTemp] = useState(userName);
  
  const [modalTemaVisivel, setModalTemaVisivel] = useState(false);
  
  const isApproved = true; 

  const handleSalvarNome = async () => {
    if (nomeTemp.trim().length < 3) {
      Alert.alert("Erro", "O nome deve ter pelo menos 3 caracteres.");
      return;
    }
    await updateUserName(nomeTemp);
    setEstaEditando(false);
  };

  const handleSair = () => {
    Alert.alert("Sair", "Deseja realmente deslogar?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: signOut }
        ]);
  };

  const selecionarTema = (modo: 'light' | 'dark' | 'system') => {
    setThemeMode(modo);
    setModalTemaVisivel(false);
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <Text style={styles.title}>Meu Perfil</Text>
          </View>
        </SafeAreaView>

        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            
            <View style={styles.nameContainer}>
              {estaEditando ? (
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.input}
                    value={nomeTemp}
                    onChangeText={setNomeTemp}
                    autoFocus
                    placeholder="Seu nome"
                    placeholderTextColor={colors.textMuted}
                  />
                  <TouchableOpacity onPress={handleSalvarNome} style={styles.saveBtn}>
                    <Check size={20} color="#FFFFFF" strokeWidth={3} />
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
                  <Pencil size={16} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.registration}>Matrícula: 2024100123</Text>
            
            <View style={[styles.statusBadge, isApproved ? styles.statusApproved : styles.statusPending]}>
              {isApproved ? <CheckCircle2 size={14} color={colors.primary} /> : <Clock size={14} color="#B45309" />}
              <Text style={[styles.statusText, isApproved ? { color: colors.primary } : { color: "#B45309" }]}>
                {isApproved ? 'Conta Aprovada' : 'Aprovação Pendente'}
              </Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <View style={styles.actionIcon}>
                <RefreshCw size={20} color={colors.textMain} />
              </View>
              <Text style={styles.actionText}>Sincronizar Grade (Offline)</Text>
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.7}
              onPress={() => setModalTemaVisivel(true)}
            >
              <View style={styles.actionIcon}>
                <Settings size={20} color={colors.textMain} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.actionText}>Aparência</Text>
                <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '500' }}>
                  {themeMode === 'system' ? 'Padrão do Sistema' : themeMode === 'light' ? 'Tema Claro' : 'Tema Escuro'}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, { marginTop: 12 }]} 
              activeOpacity={0.7}
              onPress={handleSair}
            >
              <View style={[styles.actionIcon, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : colors.dangerLight }]}>
                <LogOut size={20} color={colors.danger} />
              </View>
              <Text style={[styles.actionText, { color: colors.danger }]}>Sair do Aplicativo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={modalTemaVisivel}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalTemaVisivel(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBackdrop} onPress={() => setModalTemaVisivel(false)} />
            
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Escolher Aparência</Text>
              </View>

              <TouchableOpacity 
                style={[styles.themeOption, themeMode === 'light' && styles.themeOptionSelected]} 
                onPress={() => selecionarTema('light')}
              >
                <Sun size={24} color={themeMode === 'light' ? colors.primary : colors.textMuted} />
                <Text style={[styles.themeOptionText, themeMode === 'light' && { color: colors.primary, fontWeight: '700' }]}>
                  Claro
                </Text>
                {themeMode === 'light' && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeOption, themeMode === 'dark' && styles.themeOptionSelected]} 
                onPress={() => selecionarTema('dark')}
              >
                <Moon size={24} color={themeMode === 'dark' ? colors.primary : colors.textMuted} />
                <Text style={[styles.themeOptionText, themeMode === 'dark' && { color: colors.primary, fontWeight: '700' }]}>
                  Escuro
                </Text>
                {themeMode === 'dark' && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeOption, themeMode === 'system' && styles.themeOptionSelected]} 
                onPress={() => selecionarTema('system')}
              >
                <Smartphone size={24} color={themeMode === 'system' ? colors.primary : colors.textMuted} />
                <Text style={[styles.themeOptionText, themeMode === 'system' && { color: colors.primary, fontWeight: '700' }]}>
                  Padrão do Sistema
                </Text>
                {themeMode === 'system' && <Check size={20} color={colors.primary} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setModalTemaVisivel(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaProvider>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeHeader: { backgroundColor: colors.background },
  header: { paddingHorizontal: 24, paddingVertical: 10, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: "800", color: colors.textMain, letterSpacing: -0.5 },
  content: { paddingHorizontal: 24, flex: 1 },
  
  profileCard: { 
    alignItems: 'center', 
    backgroundColor: colors.card, 
    padding: 24, 
    borderRadius: 30, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 15, 
    elevation: 5, 
    marginBottom: 32, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '800', color: "#FFFFFF" },
  
  nameContainer: { marginBottom: 4, width: '100%', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 22, fontWeight: '800', color: colors.textMain },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 10, width: '90%' },
  input: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.textMain, borderBottomWidth: 2, borderBottomColor: colors.accent, paddingVertical: 2 },
  saveBtn: { backgroundColor: colors.accent, width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  registration: { fontSize: 14, color: colors.textMuted, fontWeight: '500', marginBottom: 16 },
  
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6 },
  statusApproved: { backgroundColor: colors.softGreen },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 13, fontWeight: '700' },

  actionsContainer: { gap: 12 },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.card, 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: colors.border 
  },
  actionIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  actionText: { fontSize: 15, fontWeight: '700', color: colors.textMain, flex: 1 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textMain,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeOptionSelected: {
    backgroundColor: colors.softGreen,
    borderColor: colors.accent,
  },
  themeOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    marginLeft: 16,
  },
  modalCancelButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: colors.background,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
  },
});