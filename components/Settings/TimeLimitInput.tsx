import { colors } from "@/constants/theme/colors";
import { spacing } from "@/constants/theme/spacing";
import { StyleSheet, Text, TextInput, View } from "react-native";

type TimeLimitInputProps = {
  hours: string;
  minutes: string;
  onHoursChange: (val: string) => void;
  onMinutesChange: (val: string) => void;
};

export const TimeLimitInput = ({
  hours,
  minutes,
  onHoursChange,
  onMinutesChange,
}: TimeLimitInputProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={hours}
          onChangeText={onHoursChange}
          keyboardType="numeric"
          placeholder="0"
        />
        <Text style={styles.unit}>h</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={minutes}
          onChangeText={onMinutesChange}
          keyboardType="numeric"
          placeholder="00"
        />
        <Text style={styles.unit}>m</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: "center",
  },
  unit: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "500",
  },
});
