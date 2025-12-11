import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from '../context/AuthContext'; 

// IMPORTANT: REPLACE WITH YOUR DEPLOYED DJANGO API URL!
const API_BASE_URL = 'http://192.168.8.103:8000/api/media-items/'; 

const MediaAdd = ({ navigation }) => {
    const { theme, themeName } = useTheme(); 
    const { userInfo } = useContext(AuthContext);
    
    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('Movie'); 
    const [estimatedTime, setEstimatedTime] = useState(''); 
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    // --- Conditional styles for Picker text and background on web ---
    const webPickerTextColorStyle = 
        Platform.OS === 'web' 
        ? { color: '#000000', backgroundColor: '#FFFFFF' }
        : { color: theme.text };

    const pickerStyleWithColor = {
        ...styles.pickerStyle,
        ...webPickerTextColorStyle, 
    };
    
    const webPickerItemStyle = 
        Platform.OS === 'web' 
        ? { backgroundColor: theme.card, color: theme.text } 
        : { color: theme.text };

    // --- CONFIGURATION FOR AUTHENTICATED REQUESTS ---
    const config = {
        headers: {
            'Authorization': `Token ${userInfo?.token}`
        }
    };

    const handleSave = async () => {
        if (!title || !estimatedTime) {
            Alert.alert("Input Error", "Please provide a title and estimated time.");
            return;
        }
        
        const timeValue = parseFloat(estimatedTime);
        
        // Ensure time must be a valid, positive number (> 0).
        if (isNaN(timeValue) || timeValue <= 0) {
            Alert.alert("Input Error", "Time (Hours) must be a positive number greater than zero.");
            return;
        }
        
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "You must be logged in to add media.");
            return;
        }

        setLoading(true);
        try {
            await axios.post(API_BASE_URL, {
                title,
                media_type: mediaType,
                // Ensure time_hours is sent as a number/string that Django accepts
                time_hours: timeValue.toFixed(2), 
                is_favorite: isFavorite,
                // ✅ FINAL FIX: Using the exact Django key 'Planned' from your models.py
                status: 'Planned', 
            }, config); 

            Alert.alert("Success", "Media item added to the backlog!");
            setTitle('');
            setEstimatedTime('');
            setIsFavorite(false);
            
            // Navigate back to the list screen to see the new item
            navigation.goBack(); 
            
        } catch (error) {
            console.error("❌ ERROR adding item:", error.response ? error.response.data : error.message);
            
            let errorMessage = "Failed to add item. Check your Django server status and console for details.";
            if (error.response?.data) {
                // Display specific errors returned by Django
                errorMessage += "\n\nValidation Details:";
                errorMessage += "\n" + Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            }
            Alert.alert("Error", errorMessage);
            
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={[styles.loading, { backgroundColor: theme.background }]} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.form}>
                
                <Text style={[styles.title, {color: theme.text, fontSize: theme.fonts.title}]}>
                    Add New Media Item
                </Text>
                
                {/* Favorite Toggle */}
                <TouchableOpacity 
                    onPress={() => setIsFavorite(!isFavorite)} 
                    style={[
                        styles.favoriteButton, 
                        isFavorite ? styles.favoriteActive : { backgroundColor: theme.card, borderColor: theme.border },
                        styles.cardShadow
                    ]}
                >
                    <Text style={[styles.favoriteButtonText, { color: isFavorite ? theme.card : theme.text, fontSize: theme.fonts.body - 2 }]}>
                        {isFavorite ? '⭐ Remove from Favorites' : 'Mark as Favorite'}
                    </Text>
                </TouchableOpacity>

                {/* Title Input */}
                <Text style={[styles.label, { color: theme.text, fontSize: theme.fonts.body - 2 }]}>Title:</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: theme.card, 
                        color: theme.text, 
                        borderColor: theme.border,
                        fontSize: theme.fonts.body - 2,
                        padding: theme.unit - 5 
                    }]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g., Dune or Foundation (Book)"
                    placeholderTextColor={theme.subtext}
                />
                
                {/* Type Selection (Picker) */}
                <Text style={[styles.label, { color: theme.text, fontSize: theme.fonts.body - 2 }]}>Type:</Text>
                <View style={[
                    styles.pickerWrapper, 
                    { 
                        backgroundColor: theme.card, 
                        borderColor: theme.border,
                    }
                ]}>
                    <Picker
                        selectedValue={mediaType}
                        onValueChange={(itemValue) => setMediaType(itemValue)}
                        style={pickerStyleWithColor} 
                    >
                        {/* Game option removed below: */}
                        <Picker.Item label="Movie" value="Movie" style={webPickerItemStyle} />
                        <Picker.Item label="TV Show" value="TV Show" style={webPickerItemStyle} />
                        <Picker.Item label="Book" value="Book" style={webPickerItemStyle} />
                    </Picker>
                </View>
                
                {/* Hours Input */}
                <Text style={[styles.label, { color: theme.text, fontSize: theme.fonts.body - 2 }]}>Time (Hours):</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: theme.card, 
                        color: theme.text, 
                        borderColor: theme.border,
                        fontSize: theme.fonts.body - 2,
                        padding: theme.unit - 5 
                    }]}
                    value={estimatedTime}
                    onChangeText={setEstimatedTime}
                    keyboardType="numeric"
                    placeholder="e.g., 3.5 (for a movie) or 20.0 (for a book)"
                    placeholderTextColor={theme.subtext}
                />
                
                {/* Save Button */}
                <TouchableOpacity onPress={handleSave} style={[styles.actionButton, styles.saveButton, {padding: theme.unit - 3, borderRadius: theme.radius}]}>
                    <Text style={[styles.buttonText, {fontSize: theme.fonts.body - 2}]}>Add to Backlog</Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.actionButton, styles.cancelButton, {padding: theme.unit - 3, borderRadius: theme.radius}]}>
                    <Text style={[styles.buttonText, {fontSize: theme.fonts.body - 2}]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 }, // Reduced screen padding
    loading: { flex: 1, justifyContent: 'center' },
    form: { 
        width: '100%', 
        maxWidth: 350, // Match MediaEdit width
        alignSelf: 'center', 
        marginTop: 5 // Reduced top margin
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15, // Reduced margin
    },
    cardShadow: Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 },
        default: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } // Lighter shadow
    }),
    label: { fontWeight: '600', marginTop: 8, marginBottom: 2 }, // Reduced margins
    input: {
        borderRadius: 4, // Sharper corners
        borderWidth: 1,
        marginBottom: 6, // Reduced margin
        height: 30, // MATCH MediaEdit height
        paddingHorizontal: 8,
    },
    pickerWrapper: {
        borderRadius: 4, // Sharper corners
        borderWidth: 1,
        overflow: 'hidden', 
        marginBottom: 6, // Reduced margin
        height: 30, // MATCH MediaEdit height
    },
    pickerStyle: {
        width: '100%',
        height: 30, // MATCH MediaEdit height
    },
    actionButton: {
        alignItems: 'center',
        marginTop: 8, // Reduced margin
        ...Platform.select({
            default: { cursor: 'pointer' },
        }),
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    favoriteButton: {
        padding: 6, // MATCH MediaEdit padding
        borderRadius: 15, // Tighter corner radius
        alignItems: 'center',
        marginBottom: 10, // Reduced margin
        borderWidth: 1,
    },
    favoriteActive: {
        backgroundColor: '#FFC107',
        borderColor: '#FFC107',
    },
    favoriteButtonText: {
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#4CAF50', 
    },
    cancelButton: {
        backgroundColor: '#6C757D', 
    },
});

export default MediaAdd;