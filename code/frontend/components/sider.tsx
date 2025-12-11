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

import { useAppTheme } from '../hooks/use-app-theme'

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const { theme } = useAppTheme();
  return (
    <>
      <Text style={[theme.text.h2, { marginBottom: 4, marginTop: 12 }]}>{title}</Text>
      <View style={{ marginBottom: 8 }}>{children}</View>
    </>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
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
      {/* Backdrop tối – bấm để đóng */}
      {isVisible && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(0,0,0,0.35)', zIndex: 9 },
          ]}
        />
      )}

      <View
        style={[
          styles.sidebarBase,
          sidebarStyle,
          {
            paddingTop: insets.top,
            width: width * 0.82,
            backgroundColor: theme.color.surface,   // nền theo theme
            borderRightColor: theme.color.border,   // viền hairline Android
            borderRightWidth: StyleSheet.hairlineWidth,
            ...theme.tokens.elevation.md,          // đổ bóng/elevation nhẹ
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ padding: theme.tokens.space.lg, paddingTop: theme.tokens.space.md }}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={onClose}
            style={{ alignSelf: 'flex-end', padding: 10 }}
            accessibilityLabel="Close menu"
            hitSlop={theme.utils.hitSlop}
          >
            <Text
              style={{
                ...theme.text.title,       // 18/24, 700
                fontSize: 26,
                lineHeight: 26,
              }}
            >
              ×
            </Text>
          </TouchableOpacity>

          <MenuSection title="Quản lý nội dung">
            <MenuItem label="Từ vựng" onPress={() => go('/admin/content/word')} />
            <MenuItem label="Ngữ pháp" onPress={() => go('/admin/content/grammar')} />
            <MenuItem label="Luyện đọc" onPress={() => go('/admin/content/reading')} />
            <MenuItem label="Luyện nói" onPress={() => go('/admin/content/speaking')} />
            <MenuItem label="Luyện nghe" onPress={() => go('/admin/content/listening')} />
            <MenuItem label="Bài học" onPress={() => go('/admin/content/lesson')} />
            <MenuItem label="Kiểm tra" onPress={() => go('/admin/content/test')} />
          </MenuSection>

          <MenuSection title="Quản lý admin">
            <MenuItem label="Danh sách tài khoản" onPress={() => go('/admin/system/admins')} />
            <MenuItem label="Danh sách nhóm quyền" onPress={() => go('/admin/system/roles')} />
            <MenuItem label="Phân quyền" onPress={() => go('/admin/system/permissons')} />
          </MenuSection>

          <MenuSection title="Quản lý người dùng">
            <MenuItem label="Danh sách tài khoản" onPress={() => go('/admin/users')} />
          </MenuSection>

          <MenuSection title="Cài đặt chung">
            <MenuItem label="Giao diện" onPress={() => go('/admin/setting')} />
          </MenuSection>
        </ScrollView>
      </View>
    </>
  );
};

function MenuItem({ label, onPress }: { label: string; onPress: () => void }) {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 10,
        borderRadius: theme.tokens.radius.md,   // 10dp
      }}
      hitSlop={theme.utils.hitSlop}
      activeOpacity={0.7}
    >
      <Text style={theme.text.body /* 16/22, màu theo light/dark */}>{label}</Text>
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

export default Sidebar;
