import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Clock, Trash2 } from "lucide-react-native";

import { useTheme } from "../context/ThemeContext";
import { Subject } from "@/types/Subject";

interface ScheduleCardProps {
  subject: Subject;
  onDelete: (id: string, name: string) => void;
}

export const ScheduleCard = ({ subject, onDelete }: ScheduleCardProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={styles.card}>
      <View style={styles.timeTag}>
        <Text style={styles.timeStart}>{subject.timeStart}</Text>
        <Text style={styles.timeEnd}>{subject.timeEnd}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.subjectText} numberOfLines={1}>
          {subject.name}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={styles.profText}>{subject.prof}</Text>
          <View style={styles.dot} />
          <Text style={styles.locationText}>{subject.location}</Text>
        </View>

        <View style={styles.dayTag}>
          <Clock size={12} color={colors.accent} />
          <Text style={styles.dayText}>{subject.schedule}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(subject.id, subject.name)}
        activeOpacity={0.6}
      >
        <Trash2 size={20} color={colors.danger} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 12,
    },
    timeTag: {
      marginRight: 12,
      alignItems: "center",
    },
    timeStart: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.textMain,
    },
    timeEnd: {
      fontSize: 12,
      color: colors.textMuted,
    },
    info: {
      flex: 1,
    },
    subjectText: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textMain,
    },
    detailsRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
      gap: 6,
    },
    profText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    locationText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    dot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.textMuted,
    },
    dayTag: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 6,
      gap: 4,
    },
    dayText: {
      fontSize: 12,
      color: colors.accent,
      fontWeight: "600",
    },
    deleteButton: {
      marginLeft: 12,
      padding: 8,
    },
  });
