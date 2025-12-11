// frontend/screens/MediaEdit.js

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';

// NOTE: Ensure your IP address is still correct if running locally
const API_BASE_URL = 'http://192.168.8.103:8000/api/media-items/';

// --- CRITICAL FIX: These keys MUST match the keys in backend/media_tracker/models.py ---
const STATUS_FINISHED_VALUE = 'Finished'; 
const STATUS_TOWATCH_VALUE = 'Planned'; 
// ---------------------------------------------------------------------------------------


const MediaEdit = ({ route, navigation }) => {
    const { itemId } = route.params;
    const { theme, themeName } = useTheme(); 
    const { userInfo } = useContext(AuthContext); 
    
    const [title, setTitle] = useState('');
    const [mediaType, setMediaType] = useState('Movie');
    const [timeHours, setTimeHours] = useState(''); 
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFinished, setIsFinished] = useState(false); 
    const [loading, setLoading] = useState(true);

    const config = {
        headers: {
            'Authorization': `Token ${userInfo?.token}` 
        }
    };

    // --- FETCH ITEM DATA ---
    useEffect(() => {
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "You must be logged in to view media details.");
            setLoading(false);
            return;
        }

        const fetchItem = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}${itemId}/`, config); 
                const item = response.data;
                setTitle(item.title);
                setMediaType(item.media_type);
                setTimeHours(item.time_hours != null ? item.time_hours.toString() : ''); 
                setIsFavorite(item.is_favorite);
                setIsFinished(item.status === STATUS_FINISHED_VALUE); 
            } catch (error) {
                console.error("Error fetching item:", error.response?.data || error.message);
                Alert.alert("Error", "Could not load item details. You may not have permission.");
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId, userInfo?.token]); 
    
    // --- Set navigation header title ---
    useEffect(() => {
        if (title) {
            navigation.setOptions({ title: `Update: ${title}` });
        }
    }, [navigation, title]);
    
    // --- INSTANT FAVORITE TOGGLE HANDLER (PATCH request) ---
    const handleFavoriteToggle = async () => {
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "Please log in to change favorites.");
            return;
        }
        
        const newFavoriteStatus = !isFavorite;
        setLoading(true);
        try {
            await axios.patch(
                `${API_BASE_URL}${itemId}/`, 
                { is_favorite: newFavoriteStatus }, 
                config
            ); 
            setIsFavorite(newFavoriteStatus); 
        } catch (error) {
            console.error("❌ FAVORITE TOGGLE FAILED:", error.response?.data || error.message);
            Alert.alert("Error", `Failed to ${newFavoriteStatus ? 'favorite' : 'unfavorite'} item.`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- INSTANT STATUS TOGGLE HANDLER (PATCH request) ---
    const handleStatusToggle = async () => {
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "Please log in to change status.");
            return;
        }

        const newFinishedStatus = !isFinished;
        const newStatusValue = newFinishedStatus ? STATUS_FINISHED_VALUE : STATUS_TOWATCH_VALUE;

        setLoading(true);
        try {
            await axios.patch(
                `${API_BASE_URL}${itemId}/`, 
                { status: newStatusValue }, 
                config
            ); 
            setIsFinished(newFinishedStatus); 
        } catch (error) {
            console.error("❌ STATUS TOGGLE FAILED:", error.response?.data || error.message);
            Alert.alert("Error", `Failed to change status.`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- MAIN SAVE HANDLER ---
    const handleSave = async () => {
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "Please log in to save changes.");
            return;
        }
        
        // --- Input Validation ---
        const numericHours = parseFloat(timeHours); 
        if (isNaN(numericHours) || numericHours < 0) {
            Alert.alert("Validation Error", "Time (Hours) must be a valid positive number.");
            return;
        }
        // --- END Input Validation ---
        
        const statusToSend = isFinished ? STATUS_FINISHED_VALUE : STATUS_TOWATCH_VALUE;
        
        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}${itemId}/`, {
                title,
                media_type: mediaType,
                time_hours: numericHours, 
                is_favorite: isFavorite, 
                status: statusToSend, 
            }, config); 

            navigation.goBack(); 
            
        } catch (error) {
            console.error("Error updating item:", error.response ? error.response.data : error.message);
            
            let errorMessage = "Failed to update item. ";
            if (error.response?.data) {
                errorMessage += "\nValidation Details:";
                errorMessage += "\n" + Object.entries(error.response.data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            }
            Alert.alert("Error", errorMessage);
            
        } finally {
            setLoading(false);
        }
    };
    
    const handleDelete = () => {
        navigation.navigate('MediaDelete', { itemId });
    };

    if (loading) {
        return <ActivityIndicator size="large" style={[styles.loading, { backgroundColor: theme.background }]} />;
    }

    // --- PICKER STYLING FIXES (for web/mobile consistency) ---
    const webPickerTextColorStyle = 
        Platform.OS === 'web' 
        ? { color: '#000000', backgroundColor: '#FFFFFF' }
        : { color: theme.text };
    
    const pickerStyleWithColor = {
        ...styles.pickerStyle,
        ...webPickerTextColorStyle,
    };
    
    const webPickerItemStyle = 
        Platform.OS === 'web' && themeName === 'dark' 
        ? { backgroundColor: theme.card, color: theme.text } 
        : { color: theme.text };
    // --- END PICKER FIXES ---


    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.scrollContent}>
            <View style={[styles.form, { backgroundColor: theme.card }]}>
                
                {/* Favorite Toggle */}
                <TouchableOpacity 
                    onPress={handleFavoriteToggle} 
                    style={[
                        styles.favoriteButton, 
                        isFavorite ? styles.favoriteActive : { backgroundColor: theme.card, borderColor: theme.border },
                        styles.cardShadow
                    ]}
                    disabled={loading} 
                >
                    <Text style={[styles.favoriteButtonText, { color: isFavorite ? theme.card : theme.text, fontSize: 16 }]}> 
                        {isFavorite ? '⭐ Remove from Favorites' : 'Add to Favorites'}
                    </Text>
                </TouchableOpacity>

                {/* Title Input */}
                <Text style={[styles.label, { color: theme.text, fontSize: 14 }]}>Title:</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: theme.inputBackground || theme.card, // Use a distinct background if available
                        color: theme.text, 
                        borderColor: theme.border,
                        fontSize: 16,
                    }]}
                    value={title}
                    onChangeText={setTitle}
                />
                
                {/* Type Selection (Picker) */}
                <Text style={[styles.label, { color: theme.text, fontSize: 14 }]}>Type:</Text>
                <View style={[
                    styles.pickerWrapper, 
                    { 
                        backgroundColor: theme.inputBackground || theme.card, 
                        borderColor: theme.border,
                    }
                ]}>
                    <Picker
                        selectedValue={mediaType}
                        onValueChange={(itemValue) => setMediaType(itemValue)}
                        style={pickerStyleWithColor} 
                    >
                        <Picker.Item label="Movie" value="Movie" style={webPickerItemStyle} />
                        <Picker.Item label="TV Show" value="TV Show" style={webPickerItemStyle} />
                        <Picker.Item label="Book" value="Book" style={webPickerItemStyle} />
                    </Picker>
                </View>
                
                {/* Hours Input */}
                <Text style={[styles.label, { color: theme.text, fontSize: 14 }]}>Time (Hours):</Text>
                <TextInput
                    style={[styles.input, { 
                        backgroundColor: theme.inputBackground || theme.card, 
                        color: theme.text, 
                        borderColor: theme.border,
                        fontSize: 16,
                    }]}
                    value={timeHours}
                    onChangeText={setTimeHours}
                    keyboardType="numeric"
                />
                
                {/* Mark as Finished Button */}
                <TouchableOpacity 
                    onPress={handleStatusToggle} 
                    style={[
                        styles.actionButton, 
                        styles.finishedButton, 
                        isFinished && styles.finishedActive, 
                        styles.largeRadius
                    ]} 
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {isFinished ? '✅ Unmark as Finished (Planned)' : 'Mark as Finished'}
                    </Text>
                </TouchableOpacity>

                {/* Save Changes Button (For Title, Type, Hours) */}
                <TouchableOpacity onPress={handleSave} style={[styles.actionButton, styles.saveButton, styles.largeRadius]} disabled={loading}> 
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>

                {/* Delete Item Button */}
                <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton, styles.largeRadius]} disabled={loading}> 
                    <Text style={styles.buttonText}>Delete Item</Text>
                </TouchableOpacity>
                
                <View style={{height: 30}} /> {/* Spacer at the bottom */}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 20, 
        paddingVertical: 10,
    }, 
    scrollContent: {
        paddingVertical: 20,
    },
    loading: { flex: 1, justifyContent: 'center' },
    
    // --- CARD CONTAINER ---
    form: { 
        padding: 25, 
        borderRadius: 16, // Soft corners
        width: '100%', 
        maxWidth: 400, 
        alignSelf: 'center', 
        marginBottom: 20,
        
        // Shadow for the card
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 6 },
            default: { boxShadow: '0 4px 10px rgba(0,0,0,0.1)' } 
        }),
    },
    
    cardShadow: Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 },
        default: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } 
    }),
    
    // --- INPUTS AND LABELS ---
    label: { 
        fontWeight: '600', 
        marginTop: 15, 
        marginBottom: 5 
    }, 
    input: {
        paddingVertical: 12, // Increased padding
        paddingHorizontal: 15,
        borderRadius: 12, // Soft corners
        borderWidth: 1,
        marginBottom: 10,
    },
    
    // --- PICKER ---
    pickerWrapper: {
        paddingVertical: 0, 
        borderRadius: 12, // Match input
        borderWidth: 1,
        overflow: 'hidden', 
        marginBottom: 10,
    },
    pickerStyle: {
        width: '100%',
        // Adjust height for native Picker vs. Web/Android
        height: Platform.OS === 'ios' ? 120 : 45, 
    },
    
    // --- BUTTONS ---
    actionButton: {
        alignItems: 'center',
        paddingVertical: 14, // Consistent padding
        marginTop: 15,
        ...Platform.select({
            default: { cursor: 'pointer' },
        }),
    },
    largeRadius: {
        borderRadius: 12,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 18, 
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    // --- FAVORITE TOGGLE ---
    favoriteButton: {
        paddingVertical: 10, 
        borderRadius: 12, // Match inputs
        alignItems: 'center',
        marginBottom: 20, 
        borderWidth: 1,
    },
    favoriteActive: {
        backgroundColor: '#FFD700', // Gold color
        borderColor: '#FFD700',
    },
    favoriteButtonText: {
        fontWeight: '700',
    },
    
    // --- STATUS TOGGLE ---
    finishedButton: {
        backgroundColor: '#007BFF', 
    },
    finishedActive: {
        backgroundColor: '#28A745', // Success Green when active
    },
    
    // --- SAVE/DELETE BUTTONS ---
    saveButton: {
        backgroundColor: '#17A2B8', // Info/Teal color for primary action
    },
    deleteButton: {
        backgroundColor: '#DC3545', 
    },
});

export default MediaEdit;