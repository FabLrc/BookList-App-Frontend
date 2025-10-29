import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";

interface StatsData {
  totalBooks: number;
  readCount: number;
  unreadCount: number;
  favoritesCount: number;
  averageRating: number;
}

export default function StatsScreen() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>
          Erreur lors du chargement des statistiques
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    color: () => theme.primary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  const readStatusData = {
    labels: ["Lus", "Non lus"],
    datasets: [
      {
        data: [stats.readCount, stats.unreadCount],
      },
    ],
  };

  const statsCategoriesData = {
    labels: ["Total", "Favoris"],
    datasets: [
      {
        data: [stats.totalBooks, stats.favoritesCount],
      },
    ],
  };

  const pieChartData = [
    {
      name: "Lus",
      value: stats.readCount,
      color: theme.primary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
    {
      name: "Non lus",
      value: stats.unreadCount,
      color: theme.textTertiary,
      legendFontColor: theme.text,
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Statistiques globales
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.totalBooks}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Livres total
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.favoritesCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Favoris
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.primary }]}>
              {stats.averageRating.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Note moyenne
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Statut de lecture
        </Text>
        <PieChart
          data={pieChartData}
          width={350}
          height={220}
          chartConfig={chartConfig}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Résumé des livres
        </Text>
        <BarChart
          data={readStatusData}
          width={350}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>
          Total vs Favoris
        </Text>
        <BarChart
          data={statsCategoriesData}
          width={350}
          height={220}
          chartConfig={chartConfig}
          yAxisLabel=""
          yAxisSuffix=""
          fromZero
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
});
