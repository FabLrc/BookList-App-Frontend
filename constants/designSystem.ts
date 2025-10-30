import { StyleSheet } from "react-native";
import { darkTheme, lightTheme, Theme } from "./theme";

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 28,
  full: 999,
};

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const fontWeight = {
  light: "300" as const,
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
  extraBold: "800" as const,
};

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const elevation = {
  sm: {
    shadowColor: "#93441A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: "#93441A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: "#93441A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    surface: {
      backgroundColor: theme.surface,
    },
    surfaceSecondary: {
      backgroundColor: theme.surfaceSecondary,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.xl,
      marginBottom: spacing.lg,
      ...elevation.md,
    },
    cardCompact: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      ...elevation.sm,
    },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    spaceBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md + 2,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
      ...elevation.sm,
    },
    buttonSecondary: {
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: borderRadius.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#2C1810",
      fontSize: fontSize.base,
      fontWeight: fontWeight.semiBold,
      letterSpacing: 0.3,
    },
    buttonTextSecondary: {
      color: theme.primary,
      fontSize: fontSize.base,
      fontWeight: fontWeight.semiBold,
      letterSpacing: 0.3,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.surface,
      ...elevation.sm,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 2,
      borderColor: theme.border,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      fontSize: fontSize.base,
      color: theme.text,
    },
    label: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semiBold,
      color: theme.text,
      marginBottom: spacing.sm,
      letterSpacing: 0.2,
    },
    textPrimary: {
      color: theme.text,
      fontSize: fontSize.base,
      lineHeight: fontSize.base * 1.5,
    },
    textSecondary: {
      color: theme.textSecondary,
      fontSize: fontSize.md,
      lineHeight: fontSize.md * 1.5,
    },
    textTertiary: {
      color: theme.textTertiary,
      fontSize: fontSize.sm,
      lineHeight: fontSize.sm * 1.5,
    },
    heading1: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: theme.text,
      letterSpacing: -0.5,
    },
    heading2: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: theme.text,
      letterSpacing: -0.3,
    },
    heading3: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semiBold,
      color: theme.text,
    },
    title: {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.semiBold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.base,
      color: theme.textSecondary,
      fontWeight: fontWeight.regular,
    },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      backgroundColor: theme.primaryLight,
    },
    badgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.semiBold,
      color: theme.primary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: spacing.md,
    },
    error: {
      color: theme.error,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    success: {
      color: theme.success,
      fontSize: fontSize.sm,
      fontWeight: fontWeight.medium,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.xl,
      padding: spacing.xxxl,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.xxl,
      width: "85%",
      maxWidth: 420,
      ...elevation.lg,
    },
  });

export { darkTheme, lightTheme };
export type { Theme };
