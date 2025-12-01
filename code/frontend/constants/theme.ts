// theme.ts
// ------------------------------------------------------
// Bộ helper dựng styles từ tokens cho RN/Expo.
// - getTheme(mode) trả về theme light/dark đầy đủ
// - Quy ước component preset: text/button/chip/card/input...
// - Mục tiêu: viết UI nhanh, nhất quán, dễ bảo trì
// ------------------------------------------------------

import { t, ThemeMode } from '../tokens/tokens';
import { Platform } from 'react-native';

export type Theme = ReturnType<typeof getTheme>;

export function getTheme(mode: ThemeMode = 'light') {
  const c = t.color[mode];   // Màu theo chế độ
  const fonts = t.font;      // Thang chữ đã chuẩn hoá

  return {
    mode,
    tokens: t,               // Expose tokens nếu cần dùng thô
    color: c,

    // Typography đã gắn màu phù hợp mode
    text: {
      h1: { ...fonts.h1, color: c.text },           // 24/30, 700 — tiêu đề màn hình
      h2: { ...fonts.h2, color: c.text },           // 20/26, 700 — tiêu đề section
      h3: { ...fonts.h3, color: c.text },           // 18/24, 700 — tiêu đề phụ
      title: { ...fonts.title, color: c.text },     // 18/24, 700 — tiêu đề card/item
      body: { ...fonts.body, color: c.text },       // 16/22 — nội dung chính
      secondary: { ...fonts.secondary, color: c.textSub }, // 14/20 — nhãn/mô tả
      meta: { ...fonts.meta, color: c.textMeta },   // 12/18 — metadata
      link: { ...fonts.body, color: c.link, fontWeight: '600' as const }, // CTA phụ/link
    },

    // Container cơ bản
    surface: {
      screen: { flex: 1, backgroundColor: c.bg }, // Nền màn hình
      card: {
        backgroundColor: c.surface,               // Bề mặt card
        borderRadius: t.radius.lg,                // Bo góc 12dp cho cảm giác mềm
        borderWidth: Platform.OS === 'ios' ? 0 : 1,      // iOS dùng shadow, Android dùng viền
        borderColor: Platform.OS === 'ios' ? 'transparent' : c.border,
        padding: t.space.lg,                      // Padding 16dp
        ...t.elevation.sm,                        // Đổ bóng nhẹ (hoặc elevation 1 Android)
      },
      input: {
        backgroundColor: c.bgSubtle,              // Nền nhạt để phân lớp
        borderColor: c.border,                    // Viền hairline
        borderWidth: 1,
        borderRadius: t.radius.md,                // Bo góc 10dp — hợp cho input
        paddingHorizontal: t.space.md,            // Padding ngang 12dp
        paddingVertical: 12,                      // Padding dọc 12dp → đủ cao, dễ bấm/đọc
      },
    },

    // Nút bấm
    button: {
      primary: {
        container: {
          minHeight: t.touch.min,                 // Hit target tối thiểu 44dp
          paddingHorizontal: t.space.lg,          // 16dp
          paddingVertical: 12,                    // 12dp
          borderRadius: t.radius.lg,              // 12dp
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          backgroundColor: c.primary,             // Nền nút theo primary
        },
        label: { ...fonts.body, fontWeight: '700' as const, color: c.primaryOn }, // Chữ trắng đậm
        disabled: { opacity: 0.5 },               // Trạng thái disabled (mờ)
      },
      ghost: {
        container: {
          minHeight: t.touch.min,
          paddingHorizontal: t.space.lg,
          paddingVertical: 12,
          borderRadius: t.radius.lg,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          backgroundColor: 'transparent',         // Không nền, phù hợp CTA phụ
        },
        label: { ...fonts.body, fontWeight: '600' as const, color: c.link }, // Màu link
      },
    },

    // Chip (filter/tag) — tối ưu bấm tay
    chip: {
      height: 34,                                  // Tổng chiều cao ~34dp → dễ bấm
      container: {
        paddingHorizontal: 12,                     // Nội dung thoáng
        paddingVertical: 6,
        borderRadius: t.radius.pill,               // Dạng viên thuốc (pill)
        borderWidth: 1,
        borderColor: c.border,
        backgroundColor: c.surface,
      },
      label: { fontSize: 14, lineHeight: 20, fontWeight: '600' as const, color: c.text }, // 14/20, đậm vừa
      active: {
        container: { backgroundColor: c.primary, borderColor: c.primary },  // Active → nền primary
        label: { color: c.primaryOn },                                     // Chữ tương phản
      },
    },

    // Danh sách — separator dùng màu border
    list: {
      itemSpacingY: 10,                           // Khoảng cách dọc giữa item
      separator: { height: 1, backgroundColor: c.border }, // Gạch phân cách hairline
    },

    // Badge JLPT — màu theo cấp độ, chữ nhỏ (meta)
    badge: {
      jlpt: (level: 'N5'|'N4'|'N3'|'N2'|'N1') => {
        const map: Record<string, string> = {
          N5: '#4CAF50', N4: '#00BCD4', N3: '#3F51B5', N2: '#9C27B0', N1: '#E91E63'
        };
        return {
          // Lưu ý: hàm này trả về các thông số cần để vẽ badge.
          // Component gọi có thể map sang View/Text thật.
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: t.radius.pill,
          backgroundColor: map[level] || c.surfaceAlt,
          color: '#FFFFFF',                        // Chữ trắng để tương phản
          ...t.font.meta,                          // 12/18 — kích thước metadata
        };
      },
    },

    // Tiện ích nhỏ: mở rộng vùng chạm để dễ bấm (đặc biệt nút icon)
    utils: {
      hitSlop: { top: 8, bottom: 8, left: 8, right: 8 } as const,
    },
  };
}

// Helpers nhanh để lấy style chữ khi cần (tuỳ chọn)
export const tx = {
  h1: (mode: ThemeMode = 'light') => getTheme(mode).text.h1,
  h2: (mode: ThemeMode = 'light') => getTheme(mode).text.h2,
  title: (mode: ThemeMode = 'light') => getTheme(mode).text.title,
  body: (mode: ThemeMode = 'light') => getTheme(mode).text.body,
  secondary: (mode: ThemeMode = 'light') => getTheme(mode).text.secondary,
  meta: (mode: ThemeMode = 'light') => getTheme(mode).text.meta,
};
