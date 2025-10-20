
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ViewStyle, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const MenuSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={{ marginBottom: 8 }}>{children}</View>
  </>
);

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
  const sidebarStyle: ViewStyle = isVisible ? styles.sidebarVisible : styles.sidebarHidden;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const go = (href: String) => {
    onClose();
    router.push(href as Parameters<typeof router.push>[0]);
  };

  return (
    <View style={[styles.sidebar, sidebarStyle, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close menu">
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>

        <MenuSection title="Quản lý nội dung">
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/word')}>
            <Text style={styles.menuText}>Từ vựng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/grammar')}>
            <Text style={styles.menuText}>Ngữ pháp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/reading')}>
            <Text style={styles.menuText}>Luyện đọc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/speaking')}>
            <Text style={styles.menuText}>Luyện nói</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/lesson')}>
            <Text style={styles.menuText}>Bài học</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/content/exam')}>
            <Text style={styles.menuText}>Kiểm tra</Text>
          </TouchableOpacity>
        </MenuSection>

        <MenuSection title="Quản lý admin">
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/admins')}>
            <Text style={styles.menuText}>Danh sách tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/admins/create')}>
            <Text style={styles.menuText}>Tạo tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/admins/roles')}>
            <Text style={styles.menuText}>Phân quyền</Text>
          </TouchableOpacity>
        </MenuSection>

        <MenuSection title="Quản lý người dùng">
          <TouchableOpacity style={styles.menuItem} onPress={() => go('/admin/users')}>
            <Text style={styles.menuText}>Danh sách tài khoản</Text>
          </TouchableOpacity>
        </MenuSection>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.82,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 5,
  },
  scrollViewContent: {
    padding: 20,
    paddingTop: 12,
  },
  sidebarVisible: {
    transform: [{ translateX: 0 }],
  },
  sidebarHidden: {
    transform: [{ translateX: -width }],
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeText: {
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 12,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 16,
  },
});

export default Sidebar;
