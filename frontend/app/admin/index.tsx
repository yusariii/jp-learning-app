import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import LayoutDefault from '../../layout-default/layout-default'
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MetricCardProps {
  title: string;
  value: number | string;
  iconName: keyof typeof Feather.glyphMap;
}



const MetricCard: React.FC<MetricCardProps> = ({ title, value, iconName }) => {
  return (
    <View style={styles.card}>
      <Feather name={iconName} size={30} color="#4A90E2" style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

const DashboardScreen: React.FC = () => {

  const insets = useSafeAreaInsets();

  const dashboardMetrics = [
    { title: 'Tài khoản Người dùng', value: 1250, iconName: 'users' as keyof typeof Feather.glyphMap },
    { title: 'Tài khoản Admin', value: 5, iconName: 'user-check' as keyof typeof Feather.glyphMap },
    { title: 'Từ vựng', value: 3500, iconName: 'book-open' as keyof typeof Feather.glyphMap },
    { title: 'Bài học', value: 50, iconName: 'layers' as keyof typeof Feather.glyphMap },
    { title: 'Bài đọc', value: 75, iconName: 'file-text' as keyof typeof Feather.glyphMap },
    { title: 'Bài luyện nói', value: 40, iconName: 'mic' as keyof typeof Feather.glyphMap },
    { title: 'Bài kiểm tra', value: 20, iconName: 'check-square' as keyof typeof Feather.glyphMap },
    { title: 'Ngữ pháp', value: 30, iconName: 'edit' as keyof typeof Feather.glyphMap },
    { title: 'Luyện nghe', value: 60, iconName: 'headphones' as keyof typeof Feather.glyphMap },
  ];

  return (
    <LayoutDefault>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: insets.bottom }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Tổng quan về dữ liệu ứng dụng</Text>
        <View style={styles.grid}>
          {dashboardMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              iconName={metric.iconName}
            />
          ))}
        </View>
      </ScrollView>
    </LayoutDefault>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Approx. half screen width for 2-column layout
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default DashboardScreen;