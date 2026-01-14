import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import BackButton from '@/components/client/ui/BackButton';

const FLOORS = [
  { id: 10, level: 10, boss: 'Rồng Vàng', locked: true },
  { id: 9, level: 9, boss: null, locked: true },
  { id: 8, level: 8, boss: null, locked: true },
  { id: 7, level: 7, boss: 'Hổ Trắng', locked: true },
  { id: 6, level: 6, boss: null, locked: true },
  { id: 5, level: 5, boss: null, locked: true },
  { id: 4, level: 4, boss: 'Phượng Hoàng', locked: true },
  { id: 3, level: 3, boss: null, locked: false },
  { id: 2, level: 2, boss: null, locked: false },
  { id: 1, level: 1, boss: null, locked: false },
];

export default function KanjiTowerScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();
  const [currentFloor] = useState(2);

  const handleFloorPress = (floor: any) => {
    if (floor.locked) {
      alert('Hoàn thành tầng trước để mở khóa!');
      return;
    }
    // Navigate to kanji challenge
    alert(`Chức năng đang phát triển: Tầng ${floor.level}`);
  };

  return (
    <View style={theme.surface.screen}>
      {/* Header */}
      <LinearGradient
        colors={['#9C27B0', '#673AB7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <BackButton 
          fallbackHref="/client/tabs/study"
          containerStyle={{ position: 'absolute', top: 16, left: 16, backgroundColor: 'rgba(255,255,255,0.25)' }}
          color="#fff"
        />
        <MaterialCommunityIcons name="castle" size={64} color="rgba(255,255,255,0.9)" />
        <Text style={styles.headerTitle}>🏯 Leo Tháp Kanji</Text>
        <Text style={styles.headerSub}>Tầng hiện tại: {currentFloor}/10</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.towerContainer}>
          {FLOORS.map((floor, index) => (
            <Animated.View
              key={floor.id}
              entering={FadeInDown.delay(index * 50)}
              style={styles.floorWrapper}
            >
              <TouchableOpacity
                style={[
                  styles.floorCard,
                  { 
                    backgroundColor: floor.locked ? '#E0E0E0' : theme.color.surface,
                    opacity: floor.locked ? 0.6 : 1,
                  }
                ]}
                onPress={() => handleFloorPress(floor)}
                disabled={floor.locked}
                activeOpacity={0.7}
              >
                {floor.locked && (
                  <View style={styles.lockIcon}>
                    <Ionicons name="lock-closed" size={20} color="#666" />
                  </View>
                )}
                
                <View style={styles.floorLevel}>
                  <Text style={styles.floorLevelText}>Tầng {floor.level}</Text>
                </View>

                {floor.boss && (
                  <View style={styles.bossTag}>
                    <Ionicons name="skull" size={16} color="#F44336" />
                    <Text style={styles.bossText}>{floor.boss}</Text>
                  </View>
                )}

                <View style={styles.floorInfo}>
                  <Text style={theme.text.body}>
                    {floor.boss ? '👹 Boss Battle' : '📚 Kanji Challenge'}
                  </Text>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={floor.locked ? '#999' : theme.color.primary} 
                  />
                </View>
              </TouchableOpacity>

              {/* Connection Line */}
              {index < FLOORS.length - 1 && (
                <View style={styles.connectionLine} />
              )}
            </Animated.View>
          ))}
        </View>

        {/* Legend */}
        <View style={[styles.legend, { backgroundColor: theme.color.surface }]}>
          <Text style={[theme.text.meta, { marginBottom: 8, fontWeight: '600' }]}>
            Hướng dẫn:
          </Text>
          <Text style={theme.text.meta}>• Hoàn thành từng tầng để mở tầng tiếp theo</Text>
          <Text style={theme.text.meta}>• Đánh bại Boss để nhận huy hiệu đặc biệt</Text>
          <Text style={theme.text.meta}>• Mỗi tầng có 20 câu hỏi về Kanji</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    paddingTop: 60,
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  towerContainer: {
    gap: 0,
  },
  floorWrapper: {
    position: 'relative',
  },
  floorCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  lockIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  floorLevel: {
    marginBottom: 8,
  },
  floorLevelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bossTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  bossText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F44336',
  },
  floorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  connectionLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  legend: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
