import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LayoutDefault from '../../layout-default/layout-default';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from "../../hooks/use-app-theme";
import { useAuth } from '@/hooks/use-auth';
import { Href, useRouter } from 'expo-router';

interface MetricCardProps {
  title: string;
  value: number | string;
  iconName: keyof typeof Feather.glyphMap;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, iconName }) => {
  const { theme } = useAppTheme();

  return (
    <View style={[theme.surface.card, stylesCard(theme)]}>
      <Feather
        name={iconName}
        size={30}
        color={theme.color.link}
        style={{ marginBottom: theme.tokens.space.sm }}
      />
      <Text style={theme.text.secondary}>{title}</Text>
      <Text
        style={{
          ...theme.text.h2,
          fontSize: 24,
          lineHeight: 30,
          marginTop: 4,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const { isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // This is the admin dashboard entry. Require an admin session (must have a role).
    if (!isAuthenticated || !role) {
      router.replace('/admin/auth/login' as Href);
    }
  }, [isLoading, isAuthenticated, role, router]);

  const dashboardMetrics = [
    { title: 'Tài khoản Người dùng', value: 1250, iconName: 'users' as const },
    { title: 'Tài khoản Admin', value: 5, iconName: 'user-check' as const },
    { title: 'Từ vựng', value: 3500, iconName: 'book-open' as const },
    { title: 'Bài học', value: 50, iconName: 'layers' as const },
    { title: 'Bài đọc', value: 75, iconName: 'file-text' as const },
    { title: 'Bài luyện nói', value: 40, iconName: 'mic' as const },
    { title: 'Bài kiểm tra', value: 20, iconName: 'check-square' as const },
    { title: 'Ngữ pháp', value: 30, iconName: 'edit' as const },
    { title: 'Luyện nghe', value: 60, iconName: 'headphones' as const },
  ];

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        screen: theme.surface.screen, 
        container: {
          padding: theme.tokens.space.md, 
          paddingBottom: insets.bottom + theme.tokens.space.xl, 
        },
        headerTitle: {
          ...theme.text.h1, 
        },
        subtitle: {
          ...theme.text.secondary, 
          marginTop: 4,
          marginBottom: theme.tokens.space.lg, 
        },
        grid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          rowGap: theme.tokens.space.md, 
        },
        cardHalf: {
          width: '48%', 
        },
      }),
    [theme.mode, insets.bottom]
  );

  if (isLoading) {
    return (
      <LayoutDefault title="Admin">
        <View style={{ padding: theme.tokens.space.md, alignItems: 'center' }}>
          <ActivityIndicator color={theme.color.textSub} />
        </View>
      </LayoutDefault>
    );
  }

  // Redirect is triggered in the effect; return nothing to avoid flashing protected UI.
  if (!isAuthenticated || !role) return null;

  return (
    <LayoutDefault>
      <ScrollView contentContainerStyle={styles.container} style={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Tổng quan về dữ liệu ứng dụng</Text>

        <View style={styles.grid}>
          {dashboardMetrics.map((m, i) => (
            <View key={i} style={styles.cardHalf}>
              <MetricCard title={m.title} value={m.value} iconName={m.iconName} />
            </View>
          ))}
        </View>
      </ScrollView>
    </LayoutDefault>
  );
};

function stylesCard(theme: ReturnType<typeof useAppTheme>['theme']) {
  return {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: theme.tokens.space.xl,
  };
}

export default DashboardScreen;
