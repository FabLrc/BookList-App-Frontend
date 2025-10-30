import { StyleSheet, Text, View } from "react-native";
import {
  borderRadius,
  elevation,
  fontSize,
  fontWeight,
  spacing,
} from "../constants/designSystem";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";

interface AppHeaderProps {
  showLogo?: boolean;
  title?: string;
  subtitle?: string;
}

export default function AppHeader({
  showLogo = true,
  title = "BookList",
  subtitle,
}: AppHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: theme.theme.card,
          borderBottomColor: theme.theme.border,
        },
        elevation.sm,
      ]}
    >
      <View style={styles.content}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Logo size="small" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              {
                color: theme.theme.text,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.theme.textSecondary,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    fontWeight: fontWeight.regular,
  },
});
