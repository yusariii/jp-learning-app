import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUserProfile, getUserProgress } from '@/api/client/user';
import { getUser, clearToken, clearUser } from '@/helpers/storage';
import { appConfirm } from '@/helpers/appAlert';
import TabScreenLayout from '@/components/client/TabScreenLayout';

export default function ProfileScreen() {
  const { theme, setPref, pref } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get stored user or fetch from API
    getUser()
      .then((storedUser) => {
        console.log('[Profile] Stored user:', storedUser);
        if (storedUser?._id) {
          setUser(storedUser);
          // Fetch progress
          return getUserProgress(storedUser._id);
        }
        throw new Error('No user found');
      })
      .then((prog) => {
        console.log('[Profile] Progress:', prog);
        setProgress(prog);
      })
      .catch((err) => {
        console.log('[Profile] Error:', err);
        // If no user, set default mock
        setUser({
          fullName: 'Guest',
          email: 'guest@example.com',
          level: 'N5',
        });
        setProgress({ xp: 0, streak: 0 });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    appConfirm(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      async () => {
        await clearToken();
        await clearUser();
        router.replace('/client/auth/login');
      }
    );
  };

  if (loading) {
    return (
      <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.color.primary} />
      </View>
    );
  }

  // Component Stats Box nhỏ
  const StatBox = ({ label, value, icon, color }: any) => (
    <View style={[styles.statBox, { backgroundColor: theme.color.surface }]}>
      <View style={{ marginBottom: 8 }}>
         <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={[theme.text.h3, { fontWeight: '800' }]}>{value}</Text>
      <Text style={theme.text.meta}>{label}</Text>
    </View>
  );

  return (
    <TabScreenLayout title="Hồ sơ" hideBottomBar={false}>
      <View style={theme.surface.screen}>
        
        {/* Header Profile */}
        <View style={[styles.header, { paddingTop: insets.top + 20, backgroundColor: theme.color.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.color.primary }]}>
              <Text style={{ fontSize: 32, color: '#fff', fontWeight: 'bold' }}>
                {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Feather name="edit-2" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={[theme.text.h2, { marginTop: 12 }]}>{user?.fullName || user?.name || 'User'}</Text>
          <Text style={theme.text.secondary}>Thành viên {user?.level || 'N5'} • {user?.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox label="Ngày Streak" value={progress?.streak || 0} icon="flame" color="#FF5722" />
          <StatBox label="Tổng XP" value={progress?.xp || 0} icon="flash" color="#FFC107" />
          <StatBox label="Xếp hạng" value="#--" icon="trophy" color="#2196F3" />
        </View>

        {/* Menu Options */}
        <View style={styles.menuContainer}>
          <Text style={[theme.text.h3, { paddingHorizontal: 20, marginBottom: 10 }]}>Cài đặt</Text>
          
          {/* Dark Mode Toggle */}
          <View style={[styles.menuItem, { backgroundColor: theme.color.surface }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E0E0E0' }]}>
                 <Ionicons name="moon" size={20} color="#555" />
              </View>
              <Text style={theme.text.body}>Chế độ tối</Text>
            </View>
            <Switch 
              value={pref === 'dark'} 
              onValueChange={(v) => setPref(v ? 'dark' : 'light')} 
            />
          </View>

          {/* Account Settings */}
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.color.surface }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                 <Ionicons name="person" size={20} color="#2196F3" />
              </View>
              <Text style={theme.text.body}>Tài khoản</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.color.textSub} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.color.surface }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                 <Ionicons name="notifications" size={20} color="#F44336" />
              </View>
              <Text style={theme.text.body}>Thông báo nhắc nhở</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.color.textSub} />
          </TouchableOpacity>

           {/* Logout */}
           <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, { backgroundColor: theme.color.surface, marginTop: 20 }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                 <MaterialIcons name="logout" size={20} color="#D32F2F" />
              </View>
              <Text style={[theme.text.body, { color: '#D32F2F', fontWeight: '600' }]}>Đăng xuất</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </TabScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  editBtn: { position: 'absolute', right: 0, bottom: 5, backgroundColor: '#000', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#fff' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30, marginTop: -25 },
  statBox: { width: '30%', padding: 15, borderRadius: 16, alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  
  menuContainer: { gap: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginHorizontal: 20, borderRadius: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});