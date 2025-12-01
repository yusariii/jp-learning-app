// components/ui/BackButton.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { router, Href } from 'expo-router';
import { useAppTheme } from '../../hooks/use-app-theme';

type BackButtonProps = {
  fallbackHref?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const BackButton: React.FC<BackButtonProps> = ({
  fallbackHref,
  containerStyle,
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
    <View style={[{ alignSelf: 'flex-start' }, containerStyle]}>
      <TouchableOpacity
        onPress={handlePress}
        style={[
          theme.button.ghost.container,
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}
        hitSlop={theme.utils.hitSlop}
      >
        <Text style={theme.button.ghost.label}>
          ← Trở lại
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
