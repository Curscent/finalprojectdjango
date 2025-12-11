// frontend/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// IMPORTANT: Production API URL on Render.com
const BASE_URL = 'https://backendfinalspeitel.onrender.com/api/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    // --- REGISTRATION ---
    const register = async (username, email, password, password2) => { 
        setIsLoading(true);
        setAuthError(null);
        try {
            // Simple request body - only send what's needed
            const data = {
                username,
                password,
                password2,
            };
            
            // Add email only if provided
            if (email && email.trim() !== '') {
                data.email = email;
            }

            console.log("📤 Registering user:", data); 

            const response = await axios.post(`${BASE_URL}auth/register/`, data);
            console.log("✅ Registration success:", response.data);

            // Get token from response
            const token = response.data.key;
            if (token) {
                // Save user and token
                const user = { username, token };
                await AsyncStorage.setItem('userInfo', JSON.stringify(user));
                setUserInfo(user);
            }
        } catch (error) {
            console.log("❌ Registration error:", error.response?.data || error.message);
            
            let message = 'Registration failed.';
            
            if (error.response?.data) {
                const data = error.response.data;
                
                // Extract first error message
                if (data.username) {
                    message = Array.isArray(data.username) ? data.username[0] : data.username;
                } else if (data.email) {
                    message = Array.isArray(data.email) ? data.email[0] : data.email;
                } else if (data.password) {
                    message = Array.isArray(data.password) ? data.password[0] : data.password;
                } else if (data.password2) {
                    message = Array.isArray(data.password2) ? data.password2[0] : data.password2;
                } else if (data.non_field_errors) {
                    message = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                } else {
                    const key = Object.keys(data)[0];
                    message = data[key];
                }
            }
            
            setAuthError(message);
        }
        setIsLoading(false);
    };

    // --- LOGIN ---
    const login = async (username, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await axios.post(`${BASE_URL}auth/login/`, {
                username,
                password,
            });

            let token = response.data.key; 
            let user = { username, token };

            setUserInfo(user);
            await AsyncStorage.setItem('userInfo', JSON.stringify(user));

        } catch (e) {
            console.log(`Login error: ${e.response?.data?.detail || e.message}`);
            setAuthError(e.response?.data?.detail || 'Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };

    // --- LOGOUT ---
    const logout = async () => {
        setIsLoading(true);
        try {
            // Ensure token exists before attempting to logout from Django
            if (userInfo && userInfo.token) {
                 await axios.post(`${BASE_URL}auth/logout/`, null, {
                    headers: { Authorization: `Token ${userInfo.token}` },
                });
            }
        } catch (e) {
            console.log(`Django logout failed: ${e.message}`);
        }
        
        await AsyncStorage.removeItem('userInfo');
        setUserInfo(null);
        setIsLoading(false);
        setAuthError(null);
    };

    // --- CHECK IF USER IS LOGGED IN (on app start) ---
    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let user = await AsyncStorage.getItem('userInfo');
            user = JSON.parse(user);

            if (user) {
                setUserInfo(user);
            }
            setIsLoading(false); 
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                userInfo,
                isLoading,
                authError,
                setAuthError, 
                register,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};