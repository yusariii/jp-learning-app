import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { router, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/hooks/use-app-theme';

type BackButtonProps = {
  fallbackHref?: string;
  containerStyle?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
};

const BackButton: React.FC<BackButtonProps> = ({
  fallbackHref,
  containerStyle,
  color,
  size = 28,
}) => {
  const { theme } = useAppTheme();

  const handlePress = () => {
    try {
      if (router.canGoBack && router.canGoBack()) {
        router.back();
        return;
      }

      if (fallbackHref) {
        router.replace(fallbackHref as Href);
        return;
      }
    } catch (e) {
      if (fallbackHref) {
        router.replace(fallbackHref as Href);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.color.surface,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        containerStyle,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="arrow-back" size={size} color={color || theme.color.text} />
    </TouchableOpacity>
  );
};

export default BackButton;
