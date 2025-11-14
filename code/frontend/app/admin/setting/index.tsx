import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../hooks/use-app-theme'
import LayoutDefault from '@/layout-default/layout-default';

const OPTS = [
  { key: 'system', label: 'Theo hệ thống' },
  { key: 'light',  label: 'Sáng (Light)'  },
  { key: 'dark',   label: 'Tối (Dark)'    },
] as const;

export default function ThemeSettingsScreen() {
  const { pref, setPref, theme, ready } = useAppTheme();
  if (!ready) {
    return <View style={[theme.surface.screen, { justifyContent: 'center', alignItems: 'center' }]}><Text style={theme.text.body}>Đang tải…</Text></View>;
  }

  return (
    <LayoutDefault title='Cài đặt'>
      <View style={[theme.surface.screen, { padding: 16 }]}>
        <Text style={theme.text.h1}>Giao diện</Text>
        <Text style={[theme.text.secondary, { marginTop: 8 }]}>
          Chọn chế độ hiển thị mặc định cho ứng dụng.
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
          {OPTS.map(o => {
            const active = pref === o.key;
            return (
              <TouchableOpacity
                key={o.key}
                onPress={() => setPref(o.key as any)}
                style={[
                  theme.chip.container,
                  { height: theme.chip.height },
                  active && theme.chip.active.container
                ]}
                hitSlop={theme.utils.hitSlop}
              >
                <Text style={[theme.chip.label, active && theme.chip.active.label]}>
                  {o.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Demo preview card */}
        <View style={[theme.surface.card, { marginTop: 24 }]}>
          <Text style={theme.text.title}>Xem trước</Text>
          <Text style={theme.text.secondary}>Đây là nội dung mô tả ở chế độ hiện tại.</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
            <TouchableOpacity style={theme.button.ghost.container}>
              <Text style={theme.button.ghost.label}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button.primary.container}>
              <Text style={theme.button.primary.label}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LayoutDefault>
  );
}
