import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons } from '@expo/vector-icons';

type WordCardProps = {
  data: {
    kanji: string;
    hiragana: string;
    mean: string;
    example?: string;
  };
};

export const WordCard = ({ data }: WordCardProps) => {
  const { theme } = useAppTheme();
  const [isFlipped, setIsFlipped] = useState(false);
  const spin = useSharedValue(0);

  // Xử lý lật thẻ
  const handleFlip = () => {
    spin.value = withTiming(isFlipped ? 0 : 1, { duration: 500 });
    setIsFlipped(!isFlipped);
  };

  // Style mặt trước
  const frontStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(spin.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      zIndex: spin.value < 0.5 ? 1 : 0, // Ẩn khi quay ra sau
    };
  });

  // Style mặt sau
  const backStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(spin.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateValue}deg` }],
      zIndex: spin.value > 0.5 ? 1 : 0, // Hiện khi quay ra trước
    };
  });

  return (
    <TouchableOpacity activeOpacity={1} onPress={handleFlip} style={styles.container}>
      {/* MẶT TRƯỚC */}
      <Animated.View style={[styles.card, theme.surface.card, styles.front, frontStyle]}>
        <Text style={{ fontSize: 80, fontWeight: 'bold', color: theme.color.text }}>{data.kanji}</Text>
        <Text style={[theme.text.secondary, { marginTop: 20 }]}>Chạm để lật</Text>
      </Animated.View>

      {/* MẶT SAU */}
      <Animated.View style={[styles.card, theme.surface.card, styles.back, backStyle]}>
        <Text style={[theme.text.h2, { color: theme.color.primary }]}>{data.hiragana}</Text>
        <View style={styles.divider} />
        <Text style={[theme.text.h3, { textAlign: 'center' }]}>{data.mean}</Text>
        
        {data.example && (
          <View style={styles.exampleBox}>
            <Text style={[theme.text.meta, { fontStyle: 'italic' }]}>{data.example}</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.soundBtn}>
          <Ionicons name="volume-high" size={24} color={theme.color.primary} />
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden', // Quan trọng: Ẩn mặt lưng khi xoay
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  front: { backgroundColor: '#fff' },
  back: { backgroundColor: '#F0F8FF' }, // Màu xanh nhạt cho mặt sau
  divider: { width: 50, height: 2, backgroundColor: '#ddd', marginVertical: 15 },
  exampleBox: { marginTop: 20, padding: 10, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 8 },
  soundBtn: { position: 'absolute', bottom: 20, right: 20, padding: 10, backgroundColor: '#fff', borderRadius: 20 }
});