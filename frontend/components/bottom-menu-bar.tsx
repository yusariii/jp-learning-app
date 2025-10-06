import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

const BottomMenuBar: React.FC = () => {
    const router = useRouter();

    const navigateTo = (path: string) => {
        router.push(`/screens/admin?${path}`);
    };

    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('/')}>
                <Feather name="home" size={24} color="#555" />
                <Text style={styles.tabText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('/profile')}>
                <Feather name="user" size={24} color="#555" />
                <Text style={styles.tabText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabItem} onPress={() => navigateTo('/settings')}>
                <Feather name="settings" size={24} color="#555" />
                <Text style={styles.tabText}>Settings</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabText: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    }
});

export default BottomMenuBar;