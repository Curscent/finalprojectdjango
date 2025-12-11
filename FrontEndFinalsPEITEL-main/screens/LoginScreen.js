// frontend/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const { isLoading, login, setAuthError, authError } = useContext(AuthContext); 
    const { theme } = useTheme();

    const handleLogin = () => {
        if (setAuthError) setAuthError(null); 
        login(username, password);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    
                    {/* 1. HEADER SECTION */}
                    <View style={styles.headerSection}>
                        <Text style={[styles.appTitle, { color: theme.primary }]}>Digital Dietitian</Text>
                        <Text style={[styles.subtitle, { color: theme.subtext }]}>
                            Welcome back! Please sign in to continue.
                        </Text>
                    </View>

                    {/* 2. FORM CARD SECTION */}
                    <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
                        
                        {/* Username Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.inputBackground || '#f8f9fa',
                                    color: theme.text,
                                    borderColor: theme.border || '#e1e4e8'
                                }]}
                                placeholder="Enter your username"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.inputBackground || '#f8f9fa',
                                    color: theme.text,
                                    borderColor: theme.border || '#e1e4e8'
                                }]}
                                placeholder="Enter your password"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        {/* Error Message Display */}
                        {authError ? (
                            <Text style={styles.errorText}>{authError}</Text>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity 
                            style={[styles.loginButton, { backgroundColor: theme.primary }]} 
                            onPress={handleLogin}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        {/* Register Link */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme.subtext }]}>
                                Don't have an account? 
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={[styles.registerLink, { color: theme.primary }]}> Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 25,
    },
    
    // --- Header Styling ---
    headerSection: {
        marginBottom: 30,
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 22,
    },

    // --- Card Styling ---
    card: {
        borderRadius: 20,
        padding: 25,
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
    },

    // --- Input Styling ---
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 12, // Softer corners
        borderWidth: 1,
        fontSize: 16,
    },

    // --- Button Styling ---
    loginButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        // Button Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },

    // --- Footer/Error Styling ---
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    footerText: {
        fontSize: 15,
    },
    registerLink: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ff4757',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '600',
    }
});

export default LoginScreen;