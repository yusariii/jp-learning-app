import React, { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, ScrollView } from "react-native";
import { Href, useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveToken, saveUser } from "@/helpers/storage";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useAuth } from "@/hooks/use-auth";
import { adminLogin } from "@/api/auth";

export default function AdminLogin() {
  const { theme } = useAppTheme();
  const { isLoading, isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    // If already logged in as an admin (has a role), don't allow staying on login screen.
    if (isAuthenticated && role) {
      router.replace('/admin' as Href);
    }
  }, [isLoading, isAuthenticated, role, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const disabled = useMemo(
    () => !email.trim() || !password.trim() || loading,
    [email, password, loading]
  );

  const submit = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await adminLogin({ email: email.trim(), password });
      
      if (res?.token) {
        const adminData = res.data?.admin;


        await saveToken(res.token);
        await saveUser(adminData);

        router.replace("/admin");
      } else {
        setErr(res?.message || "Đăng nhập admin thất bại.");
      }
    } catch {
      setErr("Lỗi mạng. Thử lại nhé.");
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[theme.surface.screen, { flex: 1 }]}>
      <LinearGradient
        colors={['#6B46C1', '#9333EA', '#C026D3']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Logo/Icon */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="shield-crown" size={52} color="#fff" />
          </View>
          <Text style={[styles.title, { color: '#fff' }]}>Khu vực Admin 🔐</Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>
            Đăng nhập để quản lý nội dung
          </Text>
        </View>

        {/* Admin Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark" size={16} color="#fff" />
            <Text style={styles.badgeText}>ADMIN ACCESS</Text>
          </View>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: theme.color.surface }]}>
          <Text style={[theme.text.h2, { marginBottom: 24, textAlign: 'center' }]}>Admin đăng nhập</Text>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.color.textMeta} style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="admin@example.com"
                placeholderTextColor={theme.color.textMeta}
                style={[theme.text.body, styles.input]}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Mật khẩu</Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.color.textMeta} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholder="••••••••"
                placeholderTextColor={theme.color.textMeta}
                style={[theme.text.body, styles.input]}
                onSubmitEditing={submit}
                returnKeyType={Platform.OS === "ios" ? "done" : "go"}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={theme.utils.hitSlop} style={styles.eyeIcon}>
                <Feather name={showPass ? "eye-off" : "eye"} size={20} color={theme.color.textMeta} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Error Message */}
          {!!err && (
            <View style={[styles.errorContainer, { backgroundColor: 'rgba(244, 67, 54, 0.1)' }]}>
              <Ionicons name="alert-circle" size={18} color={theme.color.danger} />
              <Text style={[theme.text.secondary, { color: theme.color.danger, marginLeft: 8, flex: 1 }]}>{err}</Text>
            </View>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={submit}
            disabled={disabled}
            style={[styles.loginButton, { backgroundColor: '#9333EA' }, disabled && { opacity: 0.6 }]}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Đang đăng nhập</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialCommunityIcons name="shield-check" size={20} color="#fff" />
                <Text style={[styles.buttonText, { color: '#fff' }]}>Đăng nhập Admin</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* User Login Link */}
        <TouchableOpacity 
          onPress={() => router.replace("/client/auth/login" as Href)} 
          hitSlop={theme.utils.hitSlop}
          style={styles.userLink}
        >
          <Text style={[theme.text.secondary, { textAlign: "center", color: 'rgba(255,255,255,0.8)' }]}>
            Quay lại <Text style={{ color: '#fff', fontWeight: "700" }}>Đăng nhập User</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  badgeContainer: {
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  userLink: {
    marginTop: 24,
  },
});
