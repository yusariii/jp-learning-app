import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Href, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import { useAppTheme } from "@/hooks/use-app-theme";
import AuthShell from "@/components/admin/block/AuthShell";
import { adminLogin } from "@/api/auth";

export default function AdminLogin() {
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
      const res = await adminLogin({ email: email.trim(), password });
      if (!res?.token) {
        setErr(res?.message || "Đăng nhập admin thất bại.");
        return;
      }

      // TODO: lưu token admin
      // await saveAdminToken(res.token)

      router.replace("/admin");
    } catch {
      setErr("Lỗi mạng. Thử lại nhé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      badge="ADMIN"
      title="Khu vực Admin 🔐"
      subtitle="Đăng nhập để quản lý nội dung."
      footer={
        <TouchableOpacity onPress={() => router.replace("/client/auth/login" as Href)} hitSlop={theme.utils.hitSlop}>
          <Text style={{ ...theme.text.secondary, textAlign: "center" }}>
            Quay lại <Text style={{ color: theme.color.link, fontWeight: "800" }}>User Login</Text>
          </Text>
        </TouchableOpacity>
      }
    >
      <Text style={theme.text.h2}>Admin đăng nhập</Text>

      <View style={{ marginTop: theme.tokens.space.md, gap: theme.tokens.space.md }}>
        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Email</Text>
          <View style={theme.surface.input}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="admin@example.com"
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
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
