import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, ViewStyle, GestureResponderEvent } from 'react-native';
import { appConfirm } from '@/helpers/appAlert';
import { useAppTheme } from '@/hooks/use-app-theme';

type Variant = 'solid' | 'ghost' | 'link';

export type DeleteButtonProps = {
  onConfirm: () => Promise<void> | void;   // hàm thực thi sau khi user xác nhận
  label?: string;                           // nhãn nút, mặc định "Xoá"
  confirmTitle?: string;                    // tiêu đề Alert
  confirmMessage?: string;                  // nội dung Alert
  variant?: Variant;                        // 'solid' | 'ghost' | 'link'
  disabled?: boolean;
  loading?: boolean;                        // nếu bạn điều khiển loading từ ngoài
  style?: ViewStyle;                        // style bổ sung
  hitSlop?: { top?: number; bottom?: number; left?: number; right?: number };
  // Nếu muốn bỏ xác nhận (không khuyến nghị), đặt confirm=false
  confirm?: boolean;
};

export default function DeleteButton({
  onConfirm,
  label = 'Xoá',
  confirmTitle = 'Xác nhận xoá',
  confirmMessage = 'Bạn có chắc muốn xoá mục này? Thao tác không thể hoàn tác.',
  variant = 'solid',
  disabled = false,
  loading: loadingProp,
  style,
  hitSlop,
  confirm = true,
}: DeleteButtonProps) {
  const { theme } = useAppTheme();
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = loadingProp ?? internalLoading;

  const baseTap = async (e?: GestureResponderEvent) => {
    if (disabled || loading) return;
    try {
      const maybePromise = onConfirm();
      if (maybePromise && typeof (maybePromise as Promise<any>).then === 'function') {
        setInternalLoading(true);
        await (maybePromise as Promise<any>);
      }
    } finally {
      setInternalLoading(false);
    }
  };

  const handlePress = () => {
    if (!confirm) return baseTap();
    appConfirm(confirmTitle, confirmMessage, async () => {
      await baseTap();
    });
  };

  // Styles theo variant + theme
  const common = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 10,
    paddingHorizontal: theme.tokens.space.md,
    borderRadius: theme.tokens.radius.lg,
    opacity: disabled || loading ? 0.6 : 1,
  };

  const solid = {
    backgroundColor: theme.color.danger,
  };

  const ghost = {
    borderWidth: 1,
    borderColor: theme.color.danger,
    backgroundColor: 'transparent',
  };

  const link = {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
  };

  const containerStyle =
    variant === 'solid' ? { ...common, ...solid } :
    variant === 'ghost' ? { ...common, ...ghost } :
    { ...common, ...link };

  const labelStyle =
    variant === 'solid'
      ? { ...theme.button.primary.label, color: theme.color.onDanger }
      : { ...theme.button.ghost.label, color: theme.color.danger };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      hitSlop={hitSlop ?? theme.utils.hitSlop}
      style={[containerStyle, style]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? theme.color.onDanger : theme.color.danger} />
      ) : (
        <Text style={labelStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

/* ====== Biến thể icon nhỏ nếu cần (dạng link) ====== */
export function DeleteIconButton(props: Omit<DeleteButtonProps, 'label' | 'variant'>) {
  const { theme } = useAppTheme();
  return (
    <DeleteButton
      {...props}
      variant="link"
      label="🗑"
      style={{ paddingHorizontal: 4, paddingVertical: 4 }}
      hitSlop={props.hitSlop ?? { top: 8, bottom: 8, left: 8, right: 8 }}
    />
  );
}
