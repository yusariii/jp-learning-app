import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ViewStyle,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/use-app-theme';

interface UserSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { theme } = useAppTheme();
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={[theme.text.h2, { marginBottom: 8 }]}>{title}</Text>
      <View style={{ gap: 4 }}>{children}</View>
    </View>
  );
};

export default function UserSidebar({ isVisible, onClose }: UserSidebarProps) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const sidebarStyle: ViewStyle = isVisible ? styles.sidebarVisible : styles.sidebarHidden;

  const go = (href: string) => {
    onClose();
    router.push(href as Parameters<typeof router.push>[0]);
  };

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 9 }]}
        />
      )}

      <View
        style={[
          styles.sidebarBase,
          sidebarStyle,
          {
            paddingTop: insets.top,
            width: Math.min(width * 0.84, 360),
            backgroundColor: theme.color.surface,
            borderRightColor: theme.color.border,
            borderRightWidth: StyleSheet.hairlineWidth,
            ...theme.tokens.elevation.md,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ padding: theme.tokens.space.lg, paddingTop: theme.tokens.space.md }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header mini */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: theme.color.bgSubtle,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: theme.color.border,
                }}
              >
                <Feather name="zap" size={18} color={theme.color.text} />
              </View>
              <View>
                <Text style={{ ...theme.text.title, color: theme.color.text }}>JLPT Space</Text>
                <Text style={{ ...theme.text.meta, color: theme.color.textMeta }}>User menu</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} hitSlop={theme.utils.hitSlop} style={{ padding: 8 }}>
              <Text style={{ ...theme.text.title, fontSize: 26, lineHeight: 26 }}>×</Text>
            </TouchableOpacity>
          </View>

          <MenuSection title="Học tập">
            <MenuItem icon="home" label="Trang chủ" onPress={() => go('/')} />
            <MenuItem icon="book-open" label="Bài học" onPress={() => go('/lesson')} />
            <MenuItem icon="type" label="Từ vựng" onPress={() => go('/word')} />
            <MenuItem icon="file-text" label="Ngữ pháp" onPress={() => go('/grammar')} />
            <MenuItem icon="headphones" label="Luyện nghe" onPress={() => go('/listening')} />
            <MenuItem icon="mic" label="Luyện nói" onPress={() => go('/speaking')} />
            <MenuItem icon="check-square" label="Kiểm tra" onPress={() => go('/exam')} />
          </MenuSection>

          <MenuSection title="Cá nhân">
            <MenuItem icon="bar-chart-2" label="Tiến độ" onPress={() => go('/progress')} />
            <MenuItem icon="user" label="Hồ sơ" onPress={() => go('/profile')} />
            <MenuItem icon="settings" label="Cài đặt" onPress={() => go('/setting')} />
          </MenuSection>

          <View style={{ marginTop: 18 }}>
            <TouchableOpacity
              onPress={() => go('/client/auth/login')}
              style={{
                borderWidth: 1,
                borderColor: theme.color.border,
                borderRadius: theme.tokens.radius.md,
                paddingVertical: 12,
                paddingHorizontal: 12,
                backgroundColor: theme.color.bgSubtle,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
              activeOpacity={0.85}
              hitSlop={theme.utils.hitSlop}
            >
              <Feather name="log-out" size={18} color={theme.color.textSub} />
              <Text style={{ ...theme.text.body, color: theme.color.text }}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
}) {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: theme.tokens.radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
      hitSlop={theme.utils.hitSlop}
      activeOpacity={0.75}
    >
      <Feather name={icon} size={18} color={theme.color.textSub} />
      <Text style={theme.text.body}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sidebarBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 10,
    transform: [{ translateX: 0 }],
  },
  sidebarVisible: {
    transform: [{ translateX: 0 }],
  },
  sidebarHidden: {
    transform: [{ translateX: -width }],
  },
});
