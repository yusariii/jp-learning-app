import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ViewStyle, ScrollView } from 'react-native';

interface SidebarProps {
    isVisible: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose }) => {
    const sidebarStyle: ViewStyle = isVisible ? styles.sidebarVisible : styles.sidebarHidden;

    return (
        <View style={[styles.sidebar, sidebarStyle]}>
            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>X</Text>
                </TouchableOpacity>

                <Text style={styles.logo}>Quản lý nội dung</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Từ vựng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Ngữ pháp</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Luyện đọc</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Luyện nói</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Bài học</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Kiểm tra</Text>
                </TouchableOpacity>

                <Text style={styles.logo}>Quản lý admin</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Danh sách tài khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Tạo tài khoản</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Phân quyền</Text>
                </TouchableOpacity>

                <Text style={styles.logo}>Quản lý người dùng</Text>
                <TouchableOpacity style={styles.menuItem}>
                    <Text style={styles.menuText}>Danh sách tài khoản</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width * 0.8,
        backgroundColor: '#fff',
        zIndex: 10,
        elevation: 5,
    },
    scrollViewContent: {
        padding: 20, 
    },
    sidebarVisible: {
        transform: [{ translateX: 0 }],
    },
    sidebarHidden: {
        transform: [{ translateX: -width }],
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 10,
    },
    closeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    logo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
    },
    menuItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    menuText: {
        fontSize: 16,
    },
});

export default Sidebar;