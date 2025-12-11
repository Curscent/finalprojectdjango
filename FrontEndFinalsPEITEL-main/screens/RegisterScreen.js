import React, { useState, useContext, useEffect } from 'react';
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

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); 
    
    const { isLoading, authError, register, setAuthError } = useContext(AuthContext); 
    const { theme } = useTheme();

    // Clear error state whenever the screen is opened/focused
    useEffect(() => {
        setAuthError(null);
    }, []);

    const handleRegister = async () => {
        setAuthError(null); 
        
        // 1. Basic Form Validation
        if (username.trim() === '' || password.trim() === '' || password2.trim() === '') {
            setAuthError('Username, Password, and Confirmation are required.');
            return;
        }
        
        // 2. Ensure passwords match
        if (password !== password2) {
            setAuthError('Passwords do not match.');
            return;
        }
        
        const finalEmail = email.trim();
        await register(username.trim(), finalEmail, password, password2);
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
                        <Text style={[styles.appTitle, { color: theme.primary }]}>Create Your Account</Text>
                        <Text style={[styles.subtitle, { color: theme.subtext }]}>
                            Join Digital Dietitian today.
                        </Text>
                    </View>

                    {/* 2. FORM CARD SECTION */}
                    <View style={[styles.card, { backgroundColor: theme.card || '#fff' }]}>
                        
                        {/* Error Message Display */}
                        {authError ? (
                            <Text style={styles.errorText}>{authError}</Text>
                        ) : null}

                        {/* Username Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Username</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.inputBackground || '#f8f9fa',
                                    color: theme.text,
                                    borderColor: theme.border || '#e1e4e8'
                                }]}
                                placeholder="Choose a username"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>
                        
                        {/* Email Input (Optional) */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Email (Optional)</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.inputBackground || '#f8f9fa',
                                    color: theme.text,
                                    borderColor: theme.border || '#e1e4e8'
                                }]}
                                placeholder="your@email.com"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
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
                                placeholder="Create a password"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        
                        {/* Password Confirmation Input */}
                        <View style={styles.inputContainer}>
                            <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
                            <TextInput
                                style={[styles.input, { 
                                    backgroundColor: theme.inputBackground || '#f8f9fa',
                                    color: theme.text,
                                    borderColor: theme.border || '#e1e4e8'
                                }]}
                                placeholder="Re-enter password"
                                placeholderTextColor={theme.subtext || '#a0a0a0'}
                                value={password2}
                                onChangeText={setPassword2}
                                secureTextEntry
                            />
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity 
                            style={[styles.loginButton, { backgroundColor: theme.primary }]} 
                            onPress={handleRegister}
                            disabled={isLoading}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginButtonText}>REGISTER</Text>
                            )}
                        </TouchableOpacity>

                        {/* Login Link */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme.subtext }]}>
                                Already have an account? 
                            </Text>
                            <TouchableOpacity onPress={() => {
                                setAuthError(null); 
                                navigation.navigate('Login');
                            }}>
                                <Text style={[styles.registerLink, { color: theme.primary }]}> Login here</Text>
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
        marginBottom: 20,
        alignItems: 'center',
    },
    appTitle: {
        fontSize: 28, // Slightly smaller than login screen for density
        fontWeight: '800',
        marginBottom: 5,
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
        marginBottom: 15, // Reduced margin since there are more fields
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
        marginTop: 20,
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

export default RegisterScreen;