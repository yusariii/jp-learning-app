import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import LayoutDefault from '@/layout-default/layout-default';
import { useAppTheme } from '@/hooks/use-app-theme';
import BackButton from '@/components/admin/ui/BackButton';

export default function UnauthorizedScreen() {
  const { theme } = useAppTheme();
  const router = useRouter();

  return (
    <LayoutDefault title="Không có quyền truy cập">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.tokens.space.lg }}>
        <Text style={[theme.text.title, { marginBottom: theme.tokens.space.md, textAlign: 'center' }]}>
          ❌ Không có quyền truy cập
        </Text>
        <Text style={[theme.text.secondary, { marginBottom: theme.tokens.space.lg, textAlign: 'center' }]}>
          Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
        </Text>
        
        <BackButton
          fallbackHref="/admin"
          containerStyle={{}}
        />
      </View>
    </LayoutDefault>
  );
}
