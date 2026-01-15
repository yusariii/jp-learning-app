import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform, StyleSheet, ScrollView } from "react-native";
import { Href, useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveToken, saveUser } from "@/helpers/storage";
import { useAppTheme } from "@/hooks/use-app-theme";
import JLPTPicker from "@/components/admin/ui/JLPTPicker";
import { userRegister } from "@/api/auth";

type JLPT = "" | "N5" | "N4" | "N3" | "N2" | "N1";

export default function UserRegister() {
  const { theme } = useAppTheme();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [level, setLevel] = useState<JLPT>("N5");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const validate = useMemo(() => {
    if (!email.trim()) return "Vui lòng nhập email.";
    if (!password.trim() || password.length < 6) return "Mật khẩu tối thiểu 6 ký tự.";
    if (confirm !== password) return "Mật khẩu xác nhận không khớp.";
    return "";
  }, [email, password, confirm]);

  const disabled = !!validate || loading;

  const submit = async () => {
    setErr("");
    if (validate) { setErr(validate); return; }

    setLoading(true);
    try {
      const res = await userRegister({
        email: email.trim(),
        password,
        fullName: fullName.trim() || undefined,
        level: (level || "N5") as any,
      });

      if (res?.token) {
        await saveToken(res.token);
        if (res.data?.user) {
          await saveUser(res.data.user);
        }

        router.replace("/");
      } else if (res?.message) {
        setErr(res.message);
      } else {
        router.replace("/client/auth/login" as Href);
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
        colors={[theme.color.primary, theme.color.link]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Logo/Icon */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="rocket" size={48} color="#fff" />
          </View>
          <Text style={[styles.title, { color: '#fff' }]}>Tạo tài khoản mới ✨</Text>
          <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.9)' }]}>
            Bắt đầu luyện JLPT theo lộ trình
          </Text>
        </View>

        {/* Register Card */}
        <View style={[styles.card, { backgroundColor: theme.color.surface }]}>
          <Text style={[theme.text.h2, { marginBottom: 24, textAlign: 'center' }]}>Đăng ký</Text>

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Họ tên <Text style={{ color: theme.color.textMeta }}>(tuỳ chọn)</Text></Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}>
              <Ionicons name="person-outline" size={20} color={theme.color.textMeta} style={styles.inputIcon} />
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nguyễn Văn A"
                placeholderTextColor={theme.color.textMeta}
                style={[theme.text.body, styles.input]}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* JLPT Level */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Trình độ JLPT</Text>
            <JLPTPicker value={level} onChange={setLevel} levels={["N5", "N4", "N3", "N2", "N1"]} />
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Email <Text style={{ color: theme.color.danger }}>*</Text></Text>
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
            <Text style={[theme.text.secondary, styles.label]}>Mật khẩu <Text style={{ color: theme.color.danger }}>*</Text></Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.color.textMeta} style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                placeholder="Tối thiểu 6 ký tự"
                placeholderTextColor={theme.color.textMeta}
                style={[theme.text.body, styles.input]}
                returnKeyType="next"
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={theme.utils.hitSlop} style={styles.eyeIcon}>
                <Feather name={showPass ? "eye-off" : "eye"} size={20} color={theme.color.textMeta} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[theme.text.secondary, styles.label]}>Xác nhận mật khẩu <Text style={{ color: theme.color.danger }}>*</Text></Text>
            <View style={[styles.inputContainer, { backgroundColor: theme.color.bg, borderColor: theme.color.border }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={theme.color.textMeta} style={styles.inputIcon} />
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry={!showConfirm}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor={theme.color.textMeta}
                style={[theme.text.body, styles.input]}
                onSubmitEditing={submit}
                returnKeyType={Platform.OS === "ios" ? "done" : "go"}
              />
              <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={theme.utils.hitSlop} style={styles.eyeIcon}>
                <Feather name={showConfirm ? "eye-off" : "eye"} size={20} color={theme.color.textMeta} />
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

          {/* Register Button */}
          <TouchableOpacity
            onPress={submit}
            disabled={disabled}
            style={[styles.registerButton, { backgroundColor: theme.color.primary }, disabled && { opacity: 0.6 }]}
            activeOpacity={0.85}
          >
            {loading ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[styles.buttonText, { color: '#fff' }]}>Đang tạo tài khoản</Text>
              </View>
            ) : (
              <Text style={[styles.buttonText, { color: '#fff' }]}>Tạo tài khoản</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.replace("/client/auth/login" as Href)} hitSlop={theme.utils.hitSlop}>
              <Text style={[theme.text.secondary, { textAlign: "center" }]}>
                Đã có tài khoản? <Text style={{ color: theme.color.primary, fontWeight: "700" }}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  registerButton: {
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
});
