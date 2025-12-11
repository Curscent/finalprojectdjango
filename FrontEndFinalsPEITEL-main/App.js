// frontend/App.js (FINAL FIX: ADDING THEME CONTEXT WRAPPER)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext'; 
import { ThemeProvider } from './context/ThemeContext'; // <-- NEW: Import ThemeProvider
import AppNav from './navigation/AppNav'; 

export default function App() {
  return (
    // 1. ThemeProvider MUST wrap everything because MediaList.js and other components use 'useTheme'
    <ThemeProvider> 
      {/* 2. AuthProvider manages user state, and must wrap the navigation */}
      <AuthProvider>
        {/* 3. NavigationContainer must wrap the primary navigator */}
        <NavigationContainer>
          {/* 4. AppNav handles the logic (AuthStack vs AppStack) */}
          <AppNav />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}