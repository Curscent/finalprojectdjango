import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';

// NOTE: Ensure your IP address is still correct if running locally
const API_BASE_URL = 'http://192.168.8.103:8000/api/media-items/';

// --- CRITICAL FIX: These keys MUST match the keys in backend/media_tracker/models.py ---
// Keys from your STATUS_CHOICES: ('Planned', 'Planned to Watch'), ('Finished', 'Finished')
const STATUS_FINISHED_VALUE = 'Finished'; 
const STATUS_TOWATCH_VALUE = 'Planned'; // Using 'Planned' as the opposite of 'Finished'
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
                // Check if the item's status matches the 'Finished' key
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
            // Removed success alert for cleaner flow
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
        // Uses the correct Django keys
        const newStatusValue = newFinishedStatus ? STATUS_FINISHED_VALUE : STATUS_TOWATCH_VALUE;

        setLoading(true);
        try {
            await axios.patch(
                `${API_BASE_URL}${itemId}/`, 
                { status: newStatusValue }, 
                config
            ); 
            setIsFinished(newFinishedStatus); 
            // Removed success alert for cleaner flow
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
        
        // Use the correct Django status key
        const statusToSend = isFinished ? STATUS_FINISHED_VALUE : STATUS_TOWATCH_VALUE;
        
        setLoading(true);
        try {
            // PUT request updates all fields
            await axios.put(`${API_BASE_URL}${itemId}/`, {
                title,
                media_type: mediaType,
                time_hours: numericHours, 
                is_favorite: isFavorite, 
                status: statusToSend, // This now sends 'Finished' or 'Planned'
            }, config); 

            // ⭐ This executes ONLY upon successful 200 OK response from the server
            navigation.goBack(); 
            
        } catch (error) {
            console.error("Error updating item:", error.response ? error.response.data : error.message);
            
            let errorMessage = "Failed to update item. ";
            if (error.response?.data) {
                // Display the specific validation error message from Django
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
        // Navigates to a separate screen to confirm deletion
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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.form}>
                
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
                    <Text style={[styles.favoriteButtonText, { color: isFavorite ? theme.card : theme.text, fontSize: theme.fonts.body - 2 }]}> 
                        {isFavorite ? '⭐ Remove from Favorites' : 'Add to Favorites'}
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
                    value={timeHours}
                    onChangeText={setTimeHours}
                    keyboardType="numeric"
                />
                
                {/* Mark as Finished Button */}
                <TouchableOpacity 
                    onPress={handleStatusToggle} 
                    style={[styles.actionButton, styles.finishedButton, isFinished && styles.finishedActive, {padding: theme.unit - 3, borderRadius: theme.radius}]} 
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, {fontSize: theme.fonts.body - 2}]}>
                        {isFinished ? '✅ Unmark as Finished (Planned)' : 'Mark as Finished'}
                    </Text>
                </TouchableOpacity>

                {/* Save Changes Button (For Title, Type, Hours) */}
                <TouchableOpacity onPress={handleSave} style={[styles.actionButton, styles.saveButton, {padding: theme.unit - 3, borderRadius: theme.radius}]} disabled={loading}> 
                    <Text style={[styles.buttonText, {fontSize: theme.fonts.body - 2}]}>Save Changes</Text>
                </TouchableOpacity>

                {/* Delete Item Button */}
                <TouchableOpacity onPress={handleDelete} style={[styles.actionButton, styles.deleteButton, {padding: theme.unit - 3, borderRadius: theme.radius}]} disabled={loading}> 
                    <Text style={[styles.buttonText, {fontSize: theme.fonts.body - 2}]}>Delete Item</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 }, 
    loading: { flex: 1, justifyContent: 'center' },
    form: { 
        width: '100%', 
        maxWidth: 350, 
        alignSelf: 'center', 
        marginTop: 5 
    },
    cardShadow: Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 },
        default: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } 
    }),
    label: { fontWeight: '600', marginTop: 8, marginBottom: 2 }, 
    input: {
        borderRadius: 4, 
        borderWidth: 1,
        marginBottom: 6, 
        height: 30, 
        paddingHorizontal: 8,
    },
    pickerWrapper: {
        borderRadius: 4, 
        borderWidth: 1,
        overflow: 'hidden', 
        marginBottom: 6, 
        height: 30, 
    },
    pickerStyle: {
        width: '100%',
        height: 30, 
    },
    actionButton: {
        alignItems: 'center',
        marginTop: 8, 
        ...Platform.select({
            default: { cursor: 'pointer' },
        }),
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    favoriteButton: {
        padding: 6, 
        borderRadius: 15, 
        alignItems: 'center',
        marginBottom: 10, 
        borderWidth: 1,
    },
    favoriteActive: {
        backgroundColor: '#FFC107', 
        borderColor: '#FFC107',
    },
    favoriteButtonText: {
        fontWeight: 'bold',
    },
    finishedButton: {
        backgroundColor: '#007BFF', 
    },
    finishedActive: {
        backgroundColor: '#28A745', 
    },
    saveButton: {
        backgroundColor: '#17A2B8', 
    },
    deleteButton: {
        backgroundColor: '#DC3545', 
    },
});

export default MediaEdit;