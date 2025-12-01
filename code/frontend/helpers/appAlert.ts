// helpers/appAlert.ts
import { Alert, Platform } from 'react-native';

/**
 * Thông báo đơn giản (OK)
 */
export function appAlert(
  title: string,
  message?: string,
  onOk?: () => void,
) {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    onOk?.();
  } else {
    Alert.alert(title, message || undefined, [
      { text: 'OK', onPress: () => onOk?.() },
    ]);
  }
}

/**
 * Thông báo lỗi
 */
export function appError(message: string, title = 'Lỗi') {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

/**
 * Confirm OK / Cancel, trả về qua callback.
 * Trên web dùng window.confirm, trên mobile dùng Alert.alert.
 */
export function appConfirm(
  title: string,
  message: string,
  onOk: () => void,
  onCancel?: () => void,
) {
  if (Platform.OS === 'web') {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) onOk();
    else onCancel?.();
  } else {
    Alert.alert(title, message, [
      { text: 'Huỷ', style: 'cancel', onPress: () => onCancel?.() },
      { text: 'OK', onPress: () => onOk() },
    ]);
  }
}
