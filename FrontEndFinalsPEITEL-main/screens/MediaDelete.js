// frontend/screens/MediaDelete.js (FULL, UPDATED CODE)

import React, { useState, useEffect, useContext } from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from '../context/AuthContext'; 

// IMPORTANT: REPLACE WITH YOUR DEPLOYED DJANGO API URL!
const API_BASE_URL = 'http://192.168.8.103:8000/api/media-items/'; 

const MediaDelete = ({ route, navigation }) => {
    const { itemId } = route.params;
    const { theme } = useTheme(); 
    const { userInfo } = useContext(AuthContext); 
    const [loading, setLoading] = useState(true); 
    const [itemTitle, setItemTitle] = useState(`Item ID ${itemId}`); 

    const config = {
        headers: {
            // Note: Your backend log shows successful requests, meaning auth is likely correct.
            'Authorization': `Token ${userInfo?.token}` 
        }
    };
    
    // 1. Fetch title for better user confirmation
    useEffect(() => {
        const fetchTitle = async () => {
            if (!userInfo?.token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}${itemId}/`, config); 
                setItemTitle(response.data.title);
            } catch (error) {
                // If title fetch fails, use the ID
                setItemTitle(`Item ID ${itemId} (Title Load Failed)`);
            } finally {
                setLoading(false);
            }
        };
        fetchTitle();
    }, [itemId, userInfo?.token]);


    // 2. FIX: Move navigation.setOptions into a useEffect hook to prevent re-render loop
    useEffect(() => {
        // Only set options once the title is loaded and the component isn't loading
        if (!loading) {
            navigation.setOptions({ title: `Move to Trash: ${itemTitle}` });
        }
    }, [loading, itemTitle, navigation]);


    // 3. Main Handler for "Move to Trash"
    const handleConfirmDelete = () => {
        if (!userInfo?.token) {
            Alert.alert("Authentication Error", "You must be logged in to move media to trash.");
            navigation.goBack();
            return;
        }

        // Trigger the asynchronous DELETE operation immediately
        setLoading(true);
        axios.delete(`${API_BASE_URL}${itemId}/`, config) 
            .then(() => {
                Alert.alert("Success", `"${itemTitle}" has been moved to Trash.`);
                // Navigate back to the main list screen, clearing the stack above it
                navigation.popToTop(); 
            })
            .catch((error) => {
                console.error("❌ MOVE TO TRASH FAILED:", error.response ? error.response.data : error.message);
                
                let errorMessage = "Failed to move item to trash. Check your API URL and backend status.";
                if (error.response?.status === 404) {
                    errorMessage = "Item not found or already in trash.";
                } else if (error.response?.status === 403 || error.response?.status === 401) {
                    errorMessage = "You do not have permission to delete this item.";
                }
                Alert.alert("Error", errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    
    // NOTE: If the button still doesn't work, it means the entire TouchableOpacity 
    // in the render section is being blocked. We use the UI to trigger the network request.

    if (loading) {
        return <ActivityIndicator size="large" style={[styles.loading, { backgroundColor: theme.background }]} />;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.contentBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
                
                <Text style={[styles.warningText, { color: theme.error }]}>
                    CONFIRM MOVE TO TRASH
                </Text>
                <Text style={[styles.itemIdText, { color: theme.text, fontSize: 20, fontWeight: 'bold' }]}>
                    {itemTitle}
                </Text>

                {/* The main action button which is now GUARANTEED to call handleConfirmDelete */}
                <TouchableOpacity onPress={handleConfirmDelete} style={[styles.actionButton, styles.deleteButton]}>
                    <Text style={styles.buttonText}>Move to Trash</Text> 
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.actionButton, styles.cancelButton]}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
    },
    loading: { flex: 1, justifyContent: 'center' },
    
    contentBox: {
        padding: 30,
        borderRadius: 12,
        borderWidth: 1,
        width: '100%', 
        maxWidth: 400, 
        alignItems: 'center',
        // Assuming theme.fonts.heading caused the 'text node' error, using a fixed size here.
    },

    warningText: {
        fontSize: 18, 
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    itemIdText: {
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
    },

    actionButton: {
        width: '100%',
        padding: 12, 
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 15,
        // Removed Platform.select for web cursor/boxShadow to keep it clean, assume basic RN support.
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        backgroundColor: '#DC3545', 
    },
    cancelButton: {
        backgroundColor: '#6C757D', 
    },
});

export default MediaDelete;