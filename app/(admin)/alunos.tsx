import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Check, UserCircle, Users, Mail, Hash, RefreshCcw } from 'lucide-react-native';

import { useTheme } from '../../context/ThemeContext';
import { adminService } from '../../services/adminService';
import { UserProfile } from '../../types/User';

export default function AdminUsersScreen() {
  const { colors, isDark } = useTheme();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await adminService.getPendingUsers();
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (id: string, name: string) => {
    Alert.alert("Aprovar Aluno", `Deseja liberar o acesso para ${name || 'este aluno'}?`, [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Aprovar", 
        onPress: async () => {
          const { error } = await adminService.approveUser(id);
          if (!error) {
            setUsers(users.filter(u => u.id !== id));
          } else {
            Alert.alert("Erro", "Não foi possível aprovar o usuário.");
          }
        }
      }
    ]);
  };

  const styles = createStyles(colors, isDark);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greetingText}>Gestão de Alunos</Text>
              <View style={styles.dateRow}>
                <Users size={14} color={colors.textMuted} />
                <Text style={styles.dateText}>Aprovação de novos acessos</Text>
              </View>
            </View>
            <TouchableOpacity onPress={fetchUsers} disabled={loading} style={styles.refreshBtn}>
              <RefreshCcw size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshing={loading}
          onRefresh={fetchUsers}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                  <Users size={48} color={colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>Tudo em dia!</Text>
                <Text style={styles.emptySub}>Nenhum aluno aguardando aprovação no momento.</Text>
              </View>
            ) : (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            )
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardMain}>
                <View style={[styles.avatarCircle, { backgroundColor: colors.softGreen }]}>
                  <UserCircle color={colors.primary} size={32} />
                </View>
                
                <View style={styles.infoContent}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {item.full_name || "Usuário sem nome"}
                  </Text>
                  
                  <View style={styles.detailRow}>
                    <Hash size={12} color={colors.textMuted} />
                    <Text style={styles.detailText}>{item.matricula || "S/M"}</Text>
                    <View style={styles.dot} />
                    <Mail size={12} color={colors.textMuted} />
                    <Text style={styles.detailText} numberOfLines={1}>{item.email || "S/E"}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.approveButton}
                onPress={() => handleApprove(item.id, item.full_name)}
                activeOpacity={0.7}
              >
                <Check color="#fff" size={22} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaProvider>
  );
}

const createStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  safeHeader: { backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 15 
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.textMain,
    letterSpacing: -0.5,
  },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  dateText: { fontSize: 13, color: colors.textMuted, fontWeight: "600" },
  refreshBtn: { 
    padding: 10, 
    backgroundColor: colors.softGreen, 
    borderRadius: 12 
  },
  
  scrollContent: { 
    paddingHorizontal: 24, 
    paddingTop: 10, 
    paddingBottom: 140 // Espaço para a barra flutuante
  },

  card: { 
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textMain,
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
    maxWidth: '40%',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  approveButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  emptyState: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 80,
    paddingHorizontal: 40 
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed'
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textMain,
    marginBottom: 8
  },
  emptySub: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20
  }
});