import React, { useState, useContext, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { useTheme } from '../context/ThemeContext'; // Import the theme context

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState(''); 
    
    // Destructuring AuthContext and ThemeContext
    const { isLoading, authError, register, setAuthError } = useContext(AuthContext); 
    const { theme } = useTheme(); // Use the theme hook for dynamic styles

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
        
        // 3. Prepare email value: Send empty string if field is empty (to work with dj-rest-auth)
        const finalEmail = email.trim();
        
        // 4. Call the context function
        await register(username.trim(), finalEmail, password, password2);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Title: Copied style from LoginScreen */}
            <Text style={[styles.title, { color: theme.primary }]}>Register Account</Text>

            {/* Error Message Display */}
            {authError && <Text style={[styles.errorText, { color: theme.error }]}>{authError}</Text>}

            {/* Username Input */}
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Username"
                placeholderTextColor={theme.subtext}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            
            {/* Email Input (Optional) */}
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Email (Optional)"
                placeholderTextColor={theme.subtext}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password Input */}
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Password"
                placeholderTextColor={theme.subtext}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            {/* Password Confirmation Input */}
            <TextInput
                style={[styles.input, { borderColor: theme.border, color: theme.text, backgroundColor: theme.card }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.subtext}
                value={password2}
                onChangeText={setPassword2}
                secureTextEntry
            />

            {/* Register Button */}
            <TouchableOpacity 
                style={[styles.button, { backgroundColor: theme.primary }]} 
                onPress={handleRegister}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>REGISTER</Text>
                )}
            </TouchableOpacity>
            
            {/* Login Link: Copied style from LoginScreen */}
            <TouchableOpacity onPress={() => {
                setAuthError(null); 
                navigation.navigate('Login');
            }}>
                <Text style={[styles.registerText, { color: theme.subtext }]}>
                    Already have an account? Login here
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Unified Stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32, // Larger title size
        fontWeight: 'bold',
        marginBottom: 30, // Reduced margin
    },
    input: {
        width: '100%',
        maxWidth: 300, // Matches LoginScreen's width constraint
        padding: 15,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        width: '100%',
        maxWidth: 300, // Matches LoginScreen's width constraint
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
    errorText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
    registerText: { // Replaced loginContainer/loginText/loginLink with a single TouchableOpacity/Text based on LoginScreen
        marginTop: 15,
    },
});

export default RegisterScreen;