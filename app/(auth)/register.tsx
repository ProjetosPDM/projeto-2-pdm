import React, { useState } from 'react';
import { View, Text,  TextInput,  TouchableOpacity,  StyleSheet,  ActivityIndicator,  Alert,  ScrollView, Platform, KeyboardAvoidingView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { User, Mail, Lock, Hash } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { authService } from '../../services/authService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegisterScreen() {
  const { colors, isDark } = useTheme();
  const styles = createStyles(colors);

  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !matricula || !email || !password) return Alert.alert('Erro', 'Preencha todos os campos.');
    setLoading(true);
    const { error } = await authService.signUp(email, password, nome, matricula);
    setLoading(false);
    if (error) Alert.alert('Erro', error.message);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior='padding'
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets={true}
      >
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Preencha seus dados institucionais</Text>

        <View style={styles.inputContainer}>
          <User color={colors.textMuted} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Nome Completo" 
            placeholderTextColor={colors.textMuted} 
            value={nome} 
            onChangeText={setNome} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Hash color={colors.textMuted} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Matrícula" 
            placeholderTextColor={colors.textMuted} 
            keyboardType="numeric" 
            value={matricula} 
            onChangeText={setMatricula} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail color={colors.textMuted} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="E-mail" 
            placeholderTextColor={colors.textMuted} 
            autoCapitalize="none" 
            keyboardType="email-address" 
            value={email} 
            onChangeText={setEmail} 
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock color={colors.textMuted} size={20} />
          <TextInput 
            style={styles.input} 
            placeholder="Senha" 
            placeholderTextColor={colors.textMuted} 
            secureTextEntry 
            value={password} 
            onChangeText={setPassword} 
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading} activeOpacity={0.8}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={styles.linkText}>Já tem uma conta? <Text style={styles.linkBold}>Faça login</Text></Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  scrollContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: colors.background,
    minHeight: SCREEN_HEIGHT * 0.8,
    paddingBottom: 40, 
  },
  title: { fontSize: 32, fontWeight: '800', color: colors.textMain, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: 32, marginTop: 8 },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.card, 
    borderRadius: 16, 
    marginBottom: 16, 
    paddingHorizontal: 16, 
    borderWidth: 1, 
    borderColor: colors.border,
    gap: 12
  },
  input: { flex: 1, paddingVertical: 16, fontSize: 16, color: colors.textMain },
  button: { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  linkButton: { marginTop: 24, alignItems: 'center' },
  linkText: { color: colors.textMuted, fontSize: 14 },
  linkBold: { color: colors.primary, fontWeight: '700' }
});