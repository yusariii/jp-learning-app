import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/use-app-theme';

type LessonNodeProps = {
  data: {
    id: string;
    title: string;
    status: 'locked' | 'active' | 'completed';
    stars: number;
  };
  index: number;
  xOffset: number;
  onPress: (id: string) => void;
};

export const LessonNode = React.memo(({ data, index, xOffset, onPress }: LessonNodeProps) => {
  const { theme } = useAppTheme();
  
  // Animation Scale cho nút đang học (Active)
  const scale = useSharedValue(1);
  useEffect(() => {
    if (data.status === 'active') {
      scale.value = withRepeat(withSequence(withTiming(1.15, { duration: 800 }), withTiming(1, { duration: 800 })), -1, true);
    }
  }, [data.status]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Logic màu sắc & Icon từ Theme (Đã định nghĩa ở bước trước)
  const nodeConfig = theme.game.node[data.status]; 
  const nodeSize = theme.game.nodeSize;

  // Icon mapping
  const getIcon = () => {
    if (data.status === 'completed') return 'checkmark';
    if (data.status === 'active') return 'play';
    return 'lock-closed';
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={[styles.wrapper, { transform: [{ translateX: xOffset }] }]}
    >
      {/* Label Tiêu đề */}
      <View style={[styles.label, { backgroundColor: theme.color.surface }]}>
        <Text style={theme.text.meta}>{data.title}</Text>
      </View>

      {/* Nút Tròn Chính */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={false}
        onPress={() => onPress(data.id)}
      >
        <Animated.View style={[
          styles.node,
          { 
            width: nodeSize, height: nodeSize, borderRadius: nodeSize / 2,
            backgroundColor: nodeConfig.bg,
            borderColor: 'border' in nodeConfig ? nodeConfig.border : nodeConfig.bg,
            borderWidth: data.status === 'active' ? 4 : 0
          },
          data.status === 'active' && animatedStyle // Chỉ active mới nhún nhảy
        ]}>
           <Ionicons name={getIcon() as any} size={30} color={nodeConfig.icon} />
        </Animated.View>
      </TouchableOpacity>

      {/* Sao đánh giá (Nếu đã hoàn thành) */}
      {data.status === 'completed' && (
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map(s => (
            <Ionicons 
              key={s} name="star" size={12} 
              color={s <= data.stars ? theme.game.stars.active : theme.game.stars.inactive} 
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12, // Khoảng cách dọc
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  label: {
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    shadowOpacity: 0.1, shadowRadius: 2, elevation: 1,
  },
  node: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 2,
  }
});