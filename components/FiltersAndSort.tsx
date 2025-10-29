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
    <View style={styles.container}>
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
                activeFilter === filter.type && styles.filterButtonActive,
              ]}
              onPress={() => onFilter(filter.type)}
            >
              <FontAwesome
                name={filter.icon}
                size={16}
                color={activeFilter === filter.type ? "#fff" : "#007AFF"}
              />
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === filter.type && styles.filterButtonTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sort Button */}
      <View style={styles.sortSection}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(true)}
        >
          <FontAwesome name="sort" size={16} color="#007AFF" />
          <Text style={styles.sortButtonText}>
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
          <View style={styles.sortMenu}>
            {sorts.map((sort) => (
              <TouchableOpacity
                key={sort.type}
                style={[
                  styles.sortMenuItem,
                  activeSort === sort.type && styles.sortMenuItemActive,
                ]}
                onPress={() => {
                  onSort(sort.type);
                  setShowSortMenu(false);
                }}
              >
                <Text
                  style={[
                    styles.sortMenuItemText,
                    activeSort === sort.type && styles.sortMenuItemTextActive,
                  ]}
                >
                  {sort.label}
                </Text>
                {activeSort === sort.type && (
                  <FontAwesome name="check" size={16} color="#007AFF" />
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
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filtersSection: {
    paddingVertical: 8,
  },
  filtersList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    backgroundColor: "#fff",
  },
  filterButtonActive: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  filterButtonTextActive: {
    color: "#fff",
  },
  sortSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  sortMenu: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 12,
  },
  sortMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sortMenuItemActive: {
    backgroundColor: "#f5f5f5",
  },
  sortMenuItemText: {
    fontSize: 16,
    color: "#333",
  },
  sortMenuItemTextActive: {
    fontWeight: "600",
    color: "#007AFF",
  },
});
