// frontend/screens/HomeScreen.js
import React, { useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import MediaList from './MediaList'; 

const HomeScreen = ({ navigation }) => {
    const { userInfo, logout } = useContext(AuthContext); 

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Status Bar styling to match the background */}
            <StatusBar barStyle="dark-content" backgroundColor="#f4f6f8" />
            
            <View style={styles.container}>
                
                {/* 1. NEW HEADER SECTION */}
                <View style={styles.headerContainer}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome back,</Text>
                        <Text style={styles.usernameText}>{userInfo.username}</Text>
                    </View>
                    {/* You could add a user avatar image here later */}
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>{userInfo.username.charAt(0).toUpperCase()}</Text>
                    </View>
                </View>

                {/* 2. CONTENT SECTION (MediaList) */}
                <View style={styles.listContainer}>
                    <MediaList navigation={navigation} /> 
                </View>

                {/* 3. FOOTER SECTION (Logout) */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity 
                        style={styles.logoutButton} 
                        onPress={logout}
                        activeOpacity={0.8} // Adds a nice press effect
                    >
                        <Text style={styles.logoutButtonText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f4f6f8', // Slightly off-white for a premium feel
    },
    container: {
        flex: 1,
        width: '100%',
    },
    
    // --- Header Styles ---
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
    },
    welcomeText: {
        fontSize: 14,
        color: '#636e72',
        fontWeight: '500',
    },
    usernameText: {
        fontSize: 24,
        color: '#2d3436',
        fontWeight: '800', // Extra bold for the name
        letterSpacing: 0.5,
    },
    avatarPlaceholder: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#dfe6e9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#636e72',
    },

    // --- List Styles ---
    listContainer: {
        flex: 1, // Takes up all available space between header and footer
        // Optional: Add some padding if MediaList doesn't have it
        // paddingHorizontal: 10, 
    },

    // --- Footer/Button Styles ---
    footerContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20, // Adjust for iPhone Home Indicator
        backgroundColor: '#f4f6f8', // Matches background so it blends
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 16,
        backgroundColor: '#ff4757', // A more modern, vibrant red
        borderRadius: 16, // Modern rounded corners
        alignItems: 'center',
        
        // Shadow for iOS
        shadowColor: '#ff4757',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        
        // Elevation for Android
        elevation: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase', // Makes it look more like a button action
        letterSpacing: 1,
    },
});

export default HomeScreen;