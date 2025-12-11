// frontend/context/ThemeContext.js (FINAL, UX-CORRECTED CODE FOR DARK/LIGHT MODE)

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

// --- Base Theme Configuration (Using REM-like approach for web scaling) ---

// Define a base unit size in REMs (relative to the root font size)
const BASE_REM = 16; // Standard base font size in pixels

const baseTheme = {
    // SCALING UNITS: Defined relative to BASE_REM to ensure UI scales with browser zoom
    unit: BASE_REM / 4, // 4px (Used for margins/paddings that need to be smaller than padding)
    padding: BASE_REM, // 16px (Standard padding/margin)
    radius: BASE_REM / 2, // 8px (Standard border radius)

    // FONT SIZES (Defined relative to BASE_REM for scaling)
    fonts: {
        title: 1.5 * BASE_REM, // 24px (e.g., + button)
        heading: 1.125 * BASE_REM, // 18px (e.g., List item title)
        body: BASE_REM, // 16px (Standard text)
        small: 0.875 * BASE_REM, // 14px (Details text)
    },
};

// --- Theme Palettes ---
const lightTheme = {
    ...baseTheme,
    type: 'light',
    // Light Mode Colors
    background: '#f8f9fa', // Very light gray/off-white
    card: '#ffffff', // White
    text: '#212529', // Dark gray/black
    subtext: '#6c757d', // Medium gray
    border: '#dee2e6', // Light border
    primary: '#007bff', // Blue
    error: '#dc3545', // Red
    warning: '#ffc107', // Bright Yellow (For the Binge-Watching Burden banner)
    activeFilter: '#007bff', // Blue
};

const darkTheme = {
    ...baseTheme,
    type: 'dark',
    // Dark Mode Colors
    background: '#121212', // Deep Dark Gray
    card: '#1e1e1e', // Slightly lighter dark gray for cards
    text: '#ffffff', // White
    subtext: '#b0b0b0', // Light gray
    border: '#333333', // Dark border
    primary: '#64B5F6', // Lighter Blue
    error: '#EF5350', // Light Red
    warning: '#FFB300', // Darker Amber/Orange (Less glaring for the banner in dark mode)
    activeFilter: '#64B5F6', // Lighter Blue
};

// --- ThemeContext Component ---

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Check system preference on first load
    const colorScheme = Appearance.getColorScheme();
    const [themeName, setThemeName] = useState(colorScheme === 'dark' ? 'dark' : 'light');

    // 2. Select the theme object
    const theme = themeName === 'dark' ? darkTheme : lightTheme;

    // 3. Toggle function
    const toggleTheme = () => {
        setThemeName(current => (current === 'light' ? 'dark' : 'light'));
    };

    // 4. Expose the theme and toggle function
    return (
        <ThemeContext.Provider value={{ theme, themeName, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

// 5. Export the theme object definitions for reference in other files
export { lightTheme, darkTheme };