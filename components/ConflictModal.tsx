import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { AlertTriangle, Clock, Calendar } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';

interface ConflictModalProps {
  visible: boolean;
  onClose: () => void;
  newSubject: string;
  conflictingSubject: string;
  schedule: string;
  timeStart: string;
  timeEnd: string;
}

export const ConflictModal = ({ visible, onClose, newSubject, conflictingSubject, schedule, timeStart, timeEnd }: ConflictModalProps) => {
  const { colors } = useTheme();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>

          <View style={[styles.iconContainer, { backgroundColor: colors.dangerLight }]}>
            <AlertTriangle size={32} color="#FF4444" />
          </View>

          <Text style={[styles.title, { color: colors.textMain }]}>Choque de Horário</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Não é possível adicionar esta disciplina devido a um conflito de horários.
          </Text>

          <View style={[styles.detailsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.detailRow}>
              <Calendar size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.textMain }]}>{schedule}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.textMain }]}>{timeStart} às {timeEnd}</Text>
            </View>
          </View>

          <View style={styles.comparisonContainer}>
            <View style={styles.subjectItem}>
              <Text style={styles.label}>TENTANDO ADICIONAR</Text>
              <Text style={[styles.subjectName, { color: colors.textMain }]} numberOfLines={1}>{newSubject}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.subjectItem}>
              <Text style={[styles.label, { color: '#FF4444' }]}>CONFLITO COM</Text>
              <Text style={[styles.subjectName, { color: colors.textMain }]} numberOfLines={1}>{conflictingSubject}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Entendi</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContainer: {
    width: '100%',
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  detailsBox: {
    width: '100%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700'
  },
  comparisonContainer: {
    width: '100%',
    marginBottom: 24
  },
  subjectItem: {
    width: '100%',
    paddingVertical: 4
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
    color: '#888'
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600'
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 12
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800'
  }
});