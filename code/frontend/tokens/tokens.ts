// tokens.ts
// --------------------------------------------
// Bộ "design tokens" dùng chung cho toàn app (RN/Expo/Web)
// Quy ước:
// - Kích thước chữ (fontSize) tính theo "sp", khoảng cách/radius theo "dp"
// - Tách light/dark trong color để dễ bật chế độ tối
// - Không phụ thuộc UI lib nào: có thể tái sử dụng nhiều nơi
// --------------------------------------------

export type FontToken = {
  fontSize: number;     // Cỡ chữ: đảm bảo minimum 14sp cho nội dung đọc nhiều
  lineHeight: number;   // Line-height giúp chữ Nhật (kana/kanji) đọc dễ hơn
  fontWeight?: '400' | '500' | '600' | '700'; // Trọng lượng thường dùng
  color?: string;       // Màu mặc định (có thể override theo theme)
};

export type ThemeMode = 'light' | 'dark';

export const t = {
  color: {
    // Bảng màu theo chế độ. Ưu tiên độ tương phản ≥ 4.5:1 cho text nhỏ.
    light: {
      bg: '#FFFFFF',           // Nền chung màn hình
      bgSubtle: '#FAFAFA',     // Nền nhạt cho input, section
      surface: '#FFFFFF',      // Thẻ/khung (card)
      surfaceAlt: '#F5F5F5',   // Phân lớp nhẹ
      text: '#111111',         // Chữ chính (đen xám đậm)
      textSub: '#666666',      // Chữ phụ (mô tả/nhãn)
      textMeta: '#888888',     // Metadata (thời gian, trạng thái)
      border: '#EAEAEA',       // Viền hairline (Android cần rõ hơn iOS)
      primary: '#111111',      // Màu CTA chính (nút Primary)
      primaryOn: '#FFFFFF',    // Màu chữ khi đặt trên primary
      link: '#007A6A',         // Link/CTA phụ (xanh teal đậm)
      success: '#1B9E77',      // Trạng thái thành công
      warning: '#B8860B',      // Cảnh báo
      danger: '#C62828',       // Lỗi/nguy hiểm
      onDanger: '#FFFFFF',     // Màu chữ trên nền danger
    },
    dark: {
      bg: '#0B0B0B',           // Nền tối
      bgSubtle: '#141414',     // Nền input/section tối hơn
      surface: '#121212',      // Card trong chế độ tối
      surfaceAlt: '#1B1B1B',   // Phân lớp cho bề mặt
      text: '#F2F2F2',         // Chữ chính sáng
      textSub: '#C2C2C2',      // Chữ phụ
      textMeta: '#9C9C9C',     // Metadata
      border: '#2A2A2A',       // Viền trong dark (đậm hơn để nhìn thấy)
      primary: '#EDEDED',      // CTA sáng trên nền tối
      primaryOn: '#111111',    // Chữ trên primary (tối để tương phản)
      link: '#7AD9CB',         // Link trong dark
      success: '#69D6B6',
      warning: '#E5C07B',
      danger: '#EF5350',
      onDanger: '#FFFFFF',
    },
  },

  // Thang chữ tối ưu cho VN/JP (đảm bảo dễ đọc, tránh <14sp)
  font: {
    h1: { fontSize: 24, lineHeight: 30, fontWeight: '700' } as FontToken, // Tiêu đề màn hình
    h2: { fontSize: 20, lineHeight: 26, fontWeight: '700' } as FontToken, // Tiêu đề khu/section
    h3: { fontSize: 18, lineHeight: 24, fontWeight: '700' } as FontToken, // Tiêu đề phụ
    title: { fontSize: 18, lineHeight: 24, fontWeight: '700' } as FontToken, // Tiêu đề item/card
    body: { fontSize: 16, lineHeight: 22, fontWeight: '400' } as FontToken,  // Nội dung chính
    secondary: { fontSize: 14, lineHeight: 20, fontWeight: '400' } as FontToken, // Mô tả/nhãn
    meta: { fontSize: 12, lineHeight: 18, fontWeight: '400' } as FontToken,      // Metadata nhỏ
  },

  // Khoảng cách (dp). Dùng các bậc này cho padding/margin để đồng bộ
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const,

  // Bo góc (dp). Giữ thống nhất để giao diện đồng bộ
  radius: { sm: 8, md: 10, lg: 12, pill: 999 } as const,

  // Mức độ đổ bóng (iOS) / độ cao (Android). Tránh dùng quá mạnh gây rối.
  elevation: {
    none: { elevation: 0, shadowOpacity: 0 },
    sm: { elevation: 1, shadowOpacity: 0.08, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } },
    md: { elevation: 3, shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
    lg: { elevation: 6, shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  } as const,

  // Chuẩn kích thước tối thiểu để bấm (theo Apple HIG/WCAG)
  touch: { min: 44 } as const,
};

export type Tokens = typeof t;
