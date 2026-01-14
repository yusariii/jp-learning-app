import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import TabScreenLayout from '@/components/client/TabScreenLayout';
import { getPracticeStats, getSkillCategories, type PracticeStats, type SkillCategory } from '@/api/client/user';

export default function StudyScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [practiceStats, setPracticeStats] = useState<PracticeStats | null>(null);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getPracticeStats(),
      getSkillCategories(),
    ])
      .then(([stats, categoriesRes]) => {
        setPracticeStats(stats);
        setCategories(categoriesRes.categories);
      })
      .catch((error) => {
        console.error('Failed to load practice data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Map API data to UI format
  const PRACTICE_MODES = practiceStats ? [
    { 
      id: 'review', 
      title: 'Ôn tập hàng ngày', 
      sub: `${practiceStats.dailyReview.wordsToReview} từ cần nhớ`, 
      icon: 'calendar-check', 
      color: '#FF9800', 
      bg: '#FFF3E0' 
    },
    { 
      id: 'weak', 
      title: 'Khắc phục điểm yếu', 
      sub: `${practiceStats.weakPoints.incorrectCount} câu hay sai`, 
      icon: 'band-aid', 
      color: '#F44336', 
      bg: '#FFEBEE' 
    },
    { 
      id: 'speed', 
      title: 'Thử thách tốc độ', 
      sub: `Trả lời nhanh trong 30s (${practiceStats.speedChallenge.avgAccuracy}% độ chính xác)`, 
      icon: 'timer-sand', 
      color: '#2196F3', 
      bg: '#E3F2FD' 
    },
  ] : [];

  if (loading) {
    return (
      <TabScreenLayout title="Khu Luyện Tập ⚔️" hideBottomBar={false}>
        <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.color.primary} />
        </View>
      </TabScreenLayout>
    );
  }

  return (
    <TabScreenLayout title="Khu Luyện Tập ⚔️" hideBottomBar={false}>
      <View style={theme.surface.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={theme.text.h1}>Khu Luyện Tập ⚔️</Text>
          <Text style={theme.text.body}>Rèn luyện kỹ năng mỗi ngày</Text>
        </View>

        {/* Daily Challenge Card (Banner lớn) */}
        <TouchableOpacity 
          activeOpacity={0.9} 
          style={styles.bannerWrapper}
          onPress={() => router.push('/client/practice/kanji-tower' as any)}
        >
           <LinearGradient
            colors={[theme.color.primary, '#434343']}
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.banner}
           >
             <View style={styles.bannerInfo}>
               <View style={styles.badge}>
                  <Text style={styles.badgeText}>Sự kiện</Text>
               </View>
               <Text style={styles.bannerTitle}>Leo tháp Kanji</Text>
               <Text style={styles.bannerSub}>Đánh bại Boss tầng 10 để nhận huy hiệu Rồng!</Text>
               <TouchableOpacity style={styles.playBtn}>
                 <Text style={styles.playBtnText}>Chơi ngay</Text>
               </TouchableOpacity>
             </View>
             <MaterialCommunityIcons name="castle" size={90} color="rgba(255,255,255,0.2)" style={styles.bannerIcon} />
           </LinearGradient>
        </TouchableOpacity>

        {/* Practice Modes List */}
        <Text style={[theme.text.h3, styles.sectionTitle]}>Chế độ gợi ý</Text>
        <View style={styles.list}>
          {PRACTICE_MODES.map((mode, index) => (
            <Animated.View key={mode.id} entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity 
                style={[styles.modeCard, { backgroundColor: theme.color.surface }]}
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: mode.bg }]}>
                  <MaterialCommunityIcons name={mode.icon as any} size={28} color={mode.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={theme.text.title}>{mode.title}</Text>
                  <Text style={theme.text.secondary}>{mode.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.color.textMeta} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Quick Categories Grid */}
        <Text style={[theme.text.h3, styles.sectionTitle]}>Kỹ năng</Text>
        <View style={styles.grid}>
          {categories.map((cat, index) => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.catCard, { backgroundColor: theme.color.surface, borderColor: theme.color.border }]}
              onPress={() => {
                console.log('Navigating to quiz from category:', cat.id);
                // Navigate to practice screen for each skill
                try {
                  router.push('/client/quiz');
                } catch (error) {
                  console.error('Navigation error:', error);
                }
              }}
            >
              <MaterialCommunityIcons name={cat.icon as any} size={32} color={cat.color} />
              <Text style={[theme.text.body, { marginTop: 8, fontWeight: '600' }]}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      </View>
    </TabScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  
  // Banner Styles
  bannerWrapper: { marginBottom: 30, borderRadius: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  banner: { flexDirection: 'row', borderRadius: 20, padding: 20, overflow: 'hidden', position: 'relative', minHeight: 160 },
  bannerInfo: { flex: 1, zIndex: 1 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 8, marginBottom: 4 },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 16 },
  badge: { backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  badgeText: { color: '#FFD700', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  bannerIcon: { position: 'absolute', right: -10, bottom: -10, transform: [{ rotate: '-15deg' }] },
  playBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  playBtnText: { color: '#000', fontWeight: 'bold' },

  sectionTitle: { marginBottom: 12, marginTop: 8 },

  // List Styles
  list: { gap: 12, marginBottom: 30 },
  modeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 16, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5, elevation: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },

  // Grid Styles
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  catCard: { width: '48%', padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }
});