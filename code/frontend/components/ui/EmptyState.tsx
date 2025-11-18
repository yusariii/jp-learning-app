import React from 'react';
import { Text, View } from 'react-native';
import { useAppTheme } from '../../hooks/use-app-theme'

export default function EmptyState({label}: {label: string}) {
    const { theme } = useAppTheme();
    return (
        <View style={{ padding: theme.tokens.space.lg, alignItems: 'center' }}>
            <Text style={theme.text.body}>{label}</Text>
        </View>
    );
}
