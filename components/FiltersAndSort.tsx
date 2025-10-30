import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  borderRadius,
  fontSize,
  fontWeight,
  spacing,
} from "../constants/designSystem";
import { useTheme } from "../context/ThemeContext";

type FilterType = "all" | "read" | "unread" | "favorite";
type SortType = "title" | "author" | "theme";

interface FiltersAndSortProps {
  onFilter: (filter: FilterType) => void;
  onSort: (sort: SortType) => void;
  activeFilter?: FilterType;
  activeSort?: SortType;
}

export default function FiltersAndSort({
  onFilter,
  onSort,
  activeFilter = "all",
  activeSort,
}: FiltersAndSortProps) {
  const theme = useTheme();
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filters: {
    type: FilterType;
    label: string;
    icon: keyof typeof FontAwesome.glyphMap;
  }[] = [
    { type: "all", label: "Tous", icon: "list" },
    { type: "read", label: "Lus", icon: "check-circle" },
    { type: "unread", label: "Non lus", icon: "circle-o" },
    { type: "favorite", label: "Favoris", icon: "heart" },
  ];

  const sorts: { type: SortType; label: string }[] = [
    { type: "title", label: "Titre" },
    { type: "author", label: "Auteur" },
    { type: "theme", label: "Thème" },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.theme.surface,
          borderBottomColor: theme.theme.border,
        },
      ]}
    >
      {/* Filters */}
      <View style={styles.filtersSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              style={[
                styles.filterButton,
                { borderColor: theme.theme.primary },
                activeFilter === filter.type && {
                  backgroundColor: theme.theme.primary,
                },
              ]}
              onPress={() => onFilter(filter.type)}
            >
              <FontAwesome
                name={filter.icon}
                size={16}
                color={
                  activeFilter === filter.type
                    ? theme.theme.surface
                    : theme.theme.primary
                }
              />
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      activeFilter === filter.type
                        ? theme.theme.surface
                        : theme.theme.primary,
                  },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Button */}
      <View
        style={[
          styles.sortSection,
          {
            backgroundColor: theme.theme.surface,
            borderTopColor: theme.theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(true)}
        >
          <FontAwesome name="sort" size={16} color={theme.theme.primary} />
          <Text style={[styles.sortButtonText, { color: theme.theme.primary }]}>
            Trier {activeSort && `par ${activeSort}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={showSortMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortMenu(false)}
        >
          <View
            style={[styles.sortMenu, { backgroundColor: theme.theme.surface }]}
          >
            {sorts.map((sort) => (
              <TouchableOpacity
                key={sort.type}
                style={[
                  styles.sortMenuItem,
                  activeSort === sort.type && {
                    backgroundColor: theme.theme.background,
                  },
                ]}
                onPress={() => {
                  onSort(sort.type);
                  setShowSortMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.sortMenuItemText,
                    { color: theme.theme.text },
                    activeSort === sort.type && {
                      fontWeight: "600",
                      color: theme.theme.primary,
                    },
                  ]}
                >
                  {sort.label}
                </Text>
                {activeSort === sort.type && (
                  <FontAwesome
                    name="check"
                    size={16}
                    color={theme.theme.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  filtersSection: {
    paddingVertical: spacing.sm,
  },
  filtersList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: borderRadius.sm + 2,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
  },
  sortSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sortButtonText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sortMenu: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingVertical: spacing.md,
  },
  sortMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  sortMenuItemText: {
    fontSize: fontSize.base,
  },
});
