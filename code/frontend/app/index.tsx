import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';
import { getUser } from '@/helpers/storage';
import { getUserProgress } from '@/api/client/user';

export default function HomePage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();

  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((storedUser) => {
        if (storedUser) {
          setUser(storedUser);
          return getUserProgress(storedUser.id || storedUser._id);
        }
        return Promise.resolve({ 
          progress: [], 
          xp: 0, 
          streak: 0, 
          totalLessonsCompleted: 0, 
          totalWords: 0 
        });
      })
      .then((prog) => setProgress(prog))
      .catch(() => setProgress({ 
        progress: [], 
        xp: 0, 
        streak: 0, 
        totalLessonsCompleted: 0, 
        totalWords: 0 
      }))
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    { id: 'learn', title: 'Bắt đầu học', icon: 'book-open-variant', color: '#4CAF50', route: '/client/tabs' },
    { id: 'practice', title: 'Luyện tập', icon: 'sword-cross', color: '#2196F3', route: '/client/tabs/study' },
    { id: 'test', title: 'Kiểm tra', icon: 'clipboard-check', color: '#FF9800', route: '/client/tabs' },
    { id: 'profile', title: 'Hồ sơ', icon: 'account', color: '#9C27B0', route: '/client/tabs/profile' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg, paddingTop: insets.top }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header với gradient */}
        <LinearGradient
          colors={[theme.color.primary, theme.color.link]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Xin chào 👋</Text>
              <Text style={styles.userName}>{user?.fullName || user?.name || 'Bạn'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsBtn}
              onPress={() => router.push('/client/tabs/profile')}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Progress Card */}
          <View style={[styles.progressCard, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
            <View style={styles.progressRow}>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={28} color="#FFD700" />
                <Text style={styles.statValue}>{progress?.streak || 0}</Text>
                <Text style={styles.statLabel}>Ngày</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flash" size={28} color="#FFC107" />
                <Text style={styles.statValue}>{progress?.xp || 0}</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="book" size={28} color="#4CAF50" />
                <Text style={styles.statValue}>{progress?.totalLessonsCompleted || 0}/15</Text>
                <Text style={styles.statLabel}>Bài</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Daily Goal Section */}
        <View style={[styles.section, { backgroundColor: theme.color.surface, marginTop: -20, borderRadius: 20, marginHorizontal: 16 }]}>
          <Text style={[theme.text.h3, { marginBottom: 12 }]}>Mục tiêu hôm nay</Text>
          <View style={styles.goalProgress}>
            <View style={[styles.progressBar, { backgroundColor: theme.color.border }]}>
              <View style={[styles.progressFill, { width: '40%', backgroundColor: theme.color.primary }]} />
            </View>
            <Text style={theme.text.secondary}>2/5 bài đã hoàn thành</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { paddingHorizontal: 16 }]}>
          <Text style={[theme.text.h3, { marginBottom: 16 }]}>Bắt đầu nhanh</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: theme.color.surface }]}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <MaterialCommunityIcons name={action.icon as any} size={32} color={action.color} />
                </View>
                <Text style={[theme.text.secondary, { marginTop: 8, textAlign: 'center' }]}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Continue Learning Banner */}
        <TouchableOpacity 
          style={[styles.section, { paddingHorizontal: 16 }]}
          onPress={() => router.push('/client/tabs')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueBanner}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Tiếp tục học tập 🚀</Text>
              <Text style={styles.bannerSub}>Unit 4: Chào hỏi & Làm quen</Text>
              <View style={styles.bannerProgress}>
                <View style={styles.bannerProgressBar}>
                  <View style={[styles.bannerProgressFill, { width: '65%' }]} />
                </View>
                <Text style={styles.bannerProgressText}>65%</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Admin Button (if needed) */}
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={[styles.adminBtn, { backgroundColor: theme.color.surfaceAlt }]}
            onPress={() => router.push('/admin')}
          >
            <Ionicons name="shield-checkmark" size={20} color={theme.color.link} />
            <Text style={[theme.text.secondary, { color: theme.color.link, marginLeft: 8 }]}>
              Vào trang Admin
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 20 },
  headerGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginBottom: 4 },
  userName: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    borderRadius: 16,
    padding: 16,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  section: { marginTop: 20, padding: 16 },
  goalProgress: { gap: 8 },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 12 },
  bannerProgress: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bannerProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  bannerProgressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  bannerProgressText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
  adminBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
  },
});