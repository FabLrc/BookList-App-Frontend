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
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 20,
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
  regular: "400" as const,
  medium: "500" as const,
  semiBold: "600" as const,
  bold: "700" as const,
};

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
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
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardShadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonSecondary: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: borderRadius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: fontSize.md,
      fontWeight: fontWeight.semiBold,
    },
    buttonTextSecondary: {
      color: theme.text,
      fontSize: fontSize.md,
      fontWeight: fontWeight.semiBold,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.round,
      justifyContent: "center",
      alignItems: "center",
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: fontSize.md,
      color: theme.text,
    },
    label: {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      color: theme.text,
      marginBottom: spacing.sm,
    },
    textPrimary: {
      color: theme.text,
      fontSize: fontSize.md,
    },
    textSecondary: {
      color: theme.textSecondary,
      fontSize: fontSize.sm,
    },
    textTertiary: {
      color: theme.textTertiary,
      fontSize: fontSize.xs,
    },
    heading1: {
      fontSize: fontSize.xxxl,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    heading2: {
      fontSize: fontSize.xxl,
      fontWeight: fontWeight.bold,
      color: theme.text,
    },
    heading3: {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.semiBold,
      color: theme.text,
    },
    title: {
      fontSize: fontSize.base,
      fontWeight: fontWeight.semiBold,
      color: theme.text,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: theme.textSecondary,
    },
    badge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.round,
      backgroundColor: theme.primaryLight,
    },
    badgeText: {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.medium,
      color: theme.primary,
    },
    divider: {
      height: 1,
      backgroundColor: theme.border,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    error: {
      color: theme.error,
      fontSize: fontSize.sm,
    },
    success: {
      color: theme.success,
      fontSize: fontSize.sm,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.lg,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      width: "80%",
      maxWidth: 400,
    },
  });

export { darkTheme, lightTheme };
export type { Theme };
