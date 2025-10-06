import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Sidebar from '../components/sider';
import BottomMenuBar from '../components/bottom-menu-bar';

interface LayoutDefaultProps {
    children: React.ReactNode;
}

const LayoutDefault: React.FC<LayoutDefaultProps> = ({ children }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
    const { width } = useWindowDimensions();
    const isLargeScreen: boolean = width > 768;


    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (

        <View style={styles.container} >
            {isLargeScreen && (
                <View style={styles.sidebarContainer}>
                    <Sidebar isVisible={true} onClose={() => { }} />
                </View>
            )}

            <View style={styles.contentAndHeader}>

                {!isLargeScreen && (
                    <View style={styles.header}>
                        <TouchableOpacity onPress={toggleSidebar}>
                            <Feather name="menu" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.mainContent}>
                    {children}
                </View>

                {!isLargeScreen && <BottomMenuBar />}
            </View>

            {!isLargeScreen && (
                <>
                    {isSidebarVisible && (
                        <TouchableOpacity
                            style={styles.overlay}
                            onPress={toggleSidebar}
                            activeOpacity={1}
                        />
                    )}
                    <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    sidebarContainer: {
        width: 250,
        backgroundColor: '#fff',
    },
    contentAndHeader: {
        flex: 1,
        flexDirection: 'column',
    },
    header: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        elevation: 2,
        zIndex: 1,
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 9,
    },
});

export default LayoutDefault;