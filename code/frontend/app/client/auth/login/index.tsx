import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, ScrollView } from "react-native";
import { useRouter, Href } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from "@/hooks/use-app-theme";
import { userLogin } from "@/api/auth";
import { saveToken, saveUser } from "@/helpers/storage"; 

export default function UserLogin() {
  const { theme } = useAppTheme();
  const router = useRouter();

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
      const res = await userLogin({ email: email.trim(), password });
      
      console.log('Login response:', res);
      
      // Backend trả về: { token, data: { user: {...} } }
      if (res?.token) {
        // 1. Lưu token & thông tin user
        await saveToken(res.token);
        console.log('Token saved');
        if (res.data?.user) {
          await saveUser(res.data.user);
          console.log('User saved:', res.data.user);
        }

        // 2. Chuyển hướng vào trang chủ (dùng replace để không quay lại được login)
        router.replace("/"); 
      } else {
        setErr(res?.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error('Login error:', error);
      setErr("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setLoading(false);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[theme.surface.screen, { flex: 1 }]}>
      <LinearGradient
        colors={[theme.color.primary, theme.color.link]}
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
            <Ionicons name="book" size={48} color="#fff" />
          </View>
          <Text style={[styles.title, { color: '#fff' }]}>Chào mừng quay lại! 👋</Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>
            Đăng nhập để tiếp tục luyện JLPT
          </Text>
        </View>

        {/* Login Card */}
        <View style={[styles.card, { backgroundColor: theme.color.surface }]}>
          <Text style={[theme.text.h2, { marginBottom: 24, textAlign: 'center' }]}>Đăng nhập</Text>

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
                placeholder="you@example.com"
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
            style={[styles.loginButton, { backgroundColor: theme.color.primary }, disabled && { opacity: 0.6 }]}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Đang xử lý</Text>
              </View>
            ) : (
              <Text style={[styles.buttonText, { color: '#fff' }]}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push("/client/auth/register" as Href)} hitSlop={theme.utils.hitSlop}>
              <Text style={[theme.text.secondary, { textAlign: "center" }]}>
                Chưa có tài khoản? <Text style={{ color: theme.color.primary, fontWeight: "700" }}>Đăng ký ngay</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Link */}
        <TouchableOpacity 
          onPress={() => router.push("/admin/auth/login" as Href)} 
          hitSlop={theme.utils.hitSlop}
          style={styles.adminLink}
        >
          <Text style={[theme.text.secondary, { textAlign: "center", color: 'rgba(255,255,255,0.8)' }]}>
            Bạn là admin? <Text style={{ color: '#fff', fontWeight: "700" }}>Đăng nhập Admin</Text>
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
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
  },
  adminLink: {
    marginTop: 24,
  },
});