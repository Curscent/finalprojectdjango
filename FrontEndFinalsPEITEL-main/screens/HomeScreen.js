// frontend/screens/HomeScreen.js (FINAL FIX: Passing navigation to MediaList)

import React, { useContext } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    SafeAreaView,
    TouchableOpacity
} from 'react-native';
import { AuthContext } from '../context/AuthContext'; 

// Import your existing MediaList component
import MediaList from './MediaList'; 

const HomeScreen = ({ navigation }) => {
    // HomeScreen receives the 'navigation' prop automatically from the stack navigator
    
    const { userInfo, logout } = useContext(AuthContext); 

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* *** CRITICAL FIX APPLIED HERE ***
                  We explicitly pass the 'navigation' prop received by HomeScreen 
                  down to the MediaList component, allowing MediaList to navigate 
                  to 'MediaEdit' and 'MediaAdd' screens.
                */}
                <MediaList navigation={navigation} /> 

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutButtonText}>LOGOUT ({userInfo.username})</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8', 
    },
    container: {
        flex: 1,
        width: '100%',
    },
    logoutButton: {
        width: '100%',
        padding: 15,
        backgroundColor: '#dc3545', // Red color for danger/logout
        borderRadius: 0, // Making it full width at the bottom
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;