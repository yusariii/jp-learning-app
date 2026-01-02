import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { useRouter, Href } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useAppTheme } from "@/hooks/use-app-theme";
import AuthShell from "@/components/admin/block/AuthShell";
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
      
      // Backend trả về: { token, data: { user: {...} } }
      if (res?.token) {
        // 1. Lưu token & thông tin user
        await saveToken(res.token);
        if (res.data?.user) {
          await saveUser(res.data.user);
        }

        // 2. Chuyển hướng vào trang chủ (dùng replace để không quay lại được login)
        router.replace("/"); 
      } else {
        setErr(res?.message || "Đăng nhập thất bại.");
      }
    } catch (error) {
      setErr("Lỗi kết nối. Vui lòng kiểm tra mạng.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Phần return UI giữ nguyên như cũ, chỉ thay đổi logic hàm submit ở trên)
  return (
    <AuthShell
      badge="USER"
      title="Chào mừng quay lại 👋"
      subtitle="Đăng nhập để tiếp tục luyện JLPT."
      footer={
        <View style={{ gap: theme.tokens.space.sm }}>
          <TouchableOpacity onPress={() => router.push("/client/auth/register" as Href)} hitSlop={theme.utils.hitSlop}>
            <Text style={{ ...theme.text.secondary, textAlign: "center" }}>
              Chưa có tài khoản? <Text style={{ color: theme.color.link, fontWeight: "800" }}>Đăng ký</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/admin/auth/login" as Href)} hitSlop={theme.utils.hitSlop}>
            <Text style={{ ...theme.text.secondary, textAlign: "center", color: theme.color.textMeta }}>
              Bạn là admin? <Text style={{ color: theme.color.link, fontWeight: "800" }}>Đăng nhập Admin</Text>
            </Text>
          </TouchableOpacity>
        </View>
      }
    >
      <Text style={theme.text.h2}>Đăng nhập</Text>

      <View style={{ marginTop: theme.tokens.space.md, gap: theme.tokens.space.md }}>
        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Email</Text>
          <View style={theme.surface.input}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              placeholderTextColor={theme.color.textMeta}
              style={{ ...theme.text.body, paddingVertical: 0 }}
              returnKeyType="next"
            />
          </View>
        </View>

        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Mật khẩu</Text>
          <View style={{ ...theme.surface.input, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholder="••••••••"
              placeholderTextColor={theme.color.textMeta}
              style={{ ...theme.text.body, flex: 1, paddingVertical: 0 }}
              onSubmitEditing={submit}
              returnKeyType={Platform.OS === "ios" ? "done" : "go"}
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={theme.utils.hitSlop}>
              <Feather name={showPass ? "eye-off" : "eye"} size={18} color={theme.color.textMeta} />
            </TouchableOpacity>
          </View>
        </View>

        {!!err && <Text style={{ ...theme.text.secondary, color: theme.color.danger, fontWeight: "700" }}>{err}</Text>}

        <TouchableOpacity
          onPress={submit}
          disabled={disabled}
          style={[
            theme.button.primary.container,
            disabled && { opacity: 0.6 },
          ]}
          hitSlop={theme.utils.hitSlop}
          activeOpacity={0.85}
        >
          <Text style={theme.button.primary.label}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}