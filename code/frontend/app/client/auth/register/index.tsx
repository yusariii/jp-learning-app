import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Platform } from "react-native";
import { Href, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { saveToken, saveUser } from "@/helpers/storage";
import { useAppTheme } from "@/hooks/use-app-theme";
import AuthShell from "@/components/admin/block/AuthShell";
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

  return (
    <AuthShell
      badge="USER"
      title="Tạo tài khoản mới ✨"
      subtitle="Bắt đầu luyện JLPT theo lộ trình."
      footer={
        <TouchableOpacity onPress={() => router.replace("/client/auth/login" as Href)} hitSlop={theme.utils.hitSlop}>
          <Text style={{ ...theme.text.secondary, textAlign: "center" }}>
            Đã có tài khoản? <Text style={{ color: theme.color.link, fontWeight: "800" }}>Đăng nhập</Text>
          </Text>
        </TouchableOpacity>
      }
    >
      <Text style={theme.text.h2}>Đăng ký</Text>

      <View style={{ marginTop: theme.tokens.space.md, gap: theme.tokens.space.md }}>
        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Họ tên (tuỳ chọn)</Text>
          <View style={theme.surface.input}>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nguyễn Văn A"
              placeholderTextColor={theme.color.textMeta}
              style={{ ...theme.text.body, paddingVertical: 0 }}
              returnKeyType="next"
            />
          </View>
        </View>

        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Trình độ JLPT</Text>
          <JLPTPicker value={level} onChange={setLevel} levels={["N5", "N4", "N3", "N2", "N1"]} />
        </View>

        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Email *</Text>
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
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Mật khẩu *</Text>
          <View style={{ ...theme.surface.input, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
              placeholder="Tối thiểu 6 ký tự"
              placeholderTextColor={theme.color.textMeta}
              style={{ ...theme.text.body, flex: 1, paddingVertical: 0 }}
              returnKeyType="next"
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={theme.utils.hitSlop}>
              <Feather name={showPass ? "eye-off" : "eye"} size={18} color={theme.color.textMeta} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={{ ...theme.text.secondary, marginBottom: 6 }}>Xác nhận mật khẩu *</Text>
          <View style={{ ...theme.surface.input, flexDirection: "row", alignItems: "center" }}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry={!showConfirm}
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={theme.color.textMeta}
              style={{ ...theme.text.body, flex: 1, paddingVertical: 0 }}
              onSubmitEditing={submit}
              returnKeyType={Platform.OS === "ios" ? "done" : "go"}
            />
            <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={theme.utils.hitSlop}>
              <Feather name={showConfirm ? "eye-off" : "eye"} size={18} color={theme.color.textMeta} />
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
            {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthShell>
  );
}
