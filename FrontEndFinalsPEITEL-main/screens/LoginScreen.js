// frontend/screens/LoginScreen.js (FULL, UPDATED CODE)

import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Assuming you use this for styling

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // FIX: Ensure you destructure all necessary functions from AuthContext
    const { isLoading, login, setAuthError } = useContext(AuthContext); 
    const { theme } = useTheme();

    const handleLogin = () => {
        // Clear any previous error before attempting a new login
        if (setAuthError) { // Check if setAuthError exists before calling (safer)
            setAuthError(null); 
        }
        login(username, password);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.primary }]}>Digital Dietitian</Text>

            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Username"
                placeholderTextColor={theme.subtext}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Password"
                placeholderTextColor={theme.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.primary }]} 
                onPress={handleLogin}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[styles.registerText, { color: theme.subtext }]}>
                    Don't have an account? Register
                </Text>
            </TouchableOpacity>
            
            {/* Display Auth Error if it exists (assuming authError is in AuthContext) */}
            {/* {authError && <Text style={[styles.errorText, { color: theme.error }]}>{authError}</Text>} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        maxWidth: 300,
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        maxWidth: 300,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 15,
    },
    errorText: {
        marginTop: 10,
        textAlign: 'center',
    }
});

export default LoginScreen;