import React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/hooks/use-app-theme";

export default function AuthShell({
  badge,
  title,
  subtitle,
  children,
  footer,
}: {
  badge: "USER" | "ADMIN";
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const wide = width >= 900;

  return (
    <View style={{ flex: 1, backgroundColor: theme.color.bg, paddingTop: insets.top }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: theme.tokens.space.lg,
          paddingBottom: theme.tokens.space.xxl,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: wide ? 980 : 520,
            flexDirection: wide ? "row" : "column",
            gap: theme.tokens.space.lg,
          }}
        >
          {/* HERO */}
          <View
            style={{
              flex: wide ? 1 : 0,
              minHeight: wide ? 520 : 180,
              backgroundColor: theme.color.bgSubtle,
              borderWidth: 1,
              borderColor: theme.color.border,
              borderRadius: theme.tokens.radius.lg,
              padding: theme.tokens.space.xl,
              ...theme.tokens.elevation.md,
            }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: theme.tokens.radius.pill,
                backgroundColor: theme.color.surface,
                borderWidth: 1,
                borderColor: theme.color.border,
              }}
            >
              <Text style={{ ...theme.text.secondary, fontWeight: "700" }}>{badge}</Text>
            </View>

            <Text style={{ ...theme.text.h1, marginTop: theme.tokens.space.md }}>
              {title}
            </Text>

            {!!subtitle && (
              <Text style={{ ...theme.text.body, marginTop: theme.tokens.space.sm, color: theme.color.textSub }}>
                {subtitle}
              </Text>
            )}

            <View style={{ marginTop: theme.tokens.space.lg, gap: 10 }}>
              <Text style={{ ...theme.text.secondary, color: theme.color.textSub }}>• Giao diện gọn, trẻ trung</Text>
              <Text style={{ ...theme.text.secondary, color: theme.color.textSub }}>• Tối ưu cho mobile & desktop</Text>
              <Text style={{ ...theme.text.secondary, color: theme.color.textSub }}>• Đăng nhập nhanh, rõ ràng</Text>
            </View>
          </View>

          {/* CARD */}
          <View style={{ width: "100%", maxWidth: 440, alignSelf: wide ? "stretch" : "center" }}>
            <View style={{ ...theme.surface.card, padding: theme.tokens.space.lg, ...theme.tokens.elevation.md }}>
              {children}
            </View>
            {!!footer && <View style={{ marginTop: theme.tokens.space.md }}>{footer}</View>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
