// frontend/screens/MediaList.js (UI IMPROVED)

import React, { useState, useEffect, useContext } from 'react'; 
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    Alert, 
    Platform,
    Dimensions // Used for relative button sizing
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext'; 
import { AuthContext } from '../context/AuthContext'; 

// IMPORTANT: API_BASE_URL for MEDIA ITEMS (must include the media-items path)
const API_BASE_URL = 'http://192.168.8.103:8000/api/media-items/'; 
const ACTIVE_ITEMS_ENDPOINT = API_BASE_URL;
const DELETED_ITEMS_ENDPOINT = `${API_BASE_URL}deleted/`; 

// Define colors for each media type for visual distinction
const MEDIA_TYPE_COLORS = {
    'Movie': '#007BFF', 
    'TV Show': '#28A745',
    'Book': '#FFC107', 
    'Game': '#A020F0', // Added Game Color
    'default': '#6C757D', 
};

// Helper function to safely get the color
const getItemColor = (mediaType) => {
    return MEDIA_TYPE_COLORS[mediaType] || MEDIA_TYPE_COLORS['default'];
};

// Determine the size of the ADD button based on screen width for responsive design
const screenWidth = Dimensions.get('window').width;
const ADD_BUTTON_SIZE = screenWidth > 600 ? 55 : 48; // Larger button for desktop/wider screens

const MediaList = ({ navigation }) => {
    const { theme, themeName, toggleTheme } = useTheme(); 
    const { userInfo, logout } = useContext(AuthContext); 
    
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterView, setFilterView] = useState('all'); 
    const isFocused = useIsFocused();
    const [totalHours, setTotalHours] = useState(0);
    
    // --- AUTHENTICATION HELPER ---
    const config = {
        headers: {
            'Authorization': `Token ${userInfo?.token}`
        }
    };

    // --- FAVORITE TOGGLE FUNCTION (PATCH REQUEST) ---
    const handleFavoriteToggle = async (itemId, isCurrentlyFavorite) => {
        if (!userInfo?.token) return; 
        setLoading(true); 
        
        const newStatus = !isCurrentlyFavorite; 
        
        try {
            await axios.patch(
                `${ACTIVE_ITEMS_ENDPOINT}${itemId}/`, 
                { is_favorite: newStatus }, 
                config
            ); 
            // Re-fetch the data to update the list and re-sort
            fetchMediaItems(); 
        } catch (error) {
            console.error("❌ FAVORITE TOGGLE FAILED:", error.response ? error.response.data : error.message);
            Alert.alert("Error", `Failed to ${newStatus ? 'favorite' : 'unfavorite'} item.`);
            setLoading(false);
        }
    };
    // --------------------------------------------------

    const handleRestore = async (itemId) => {
        if (!userInfo?.token) return; 
        try {
            await axios.post(`${ACTIVE_ITEMS_ENDPOINT}${itemId}/restore/`, null, config); 
            fetchMediaItems(); 
        } catch (error) {
            console.error("❌ RESTORE FAILED:", error.response ? error.response.data : error.message);
            Alert.alert("Error", "Failed to restore item.");
        }
    };
    
    const handleUnmarkFinished = async (itemId) => {
        if (!userInfo?.token) return; 
        try {
            await axios.post(`${ACTIVE_ITEMS_ENDPOINT}${itemId}/unmark_finished/`, null, config); 
            fetchMediaItems(); 
        } catch (error) {
            console.error("❌ UNMARK FAILED:", error.response ? error.response.data : error.message);
            Alert.alert("Error", "Failed to unmark item.");
        }
    };

    const fetchMediaItems = async () => {
        if (!userInfo?.token) {
            setLoading(false);
            setMediaItems([]);
            return;
        }

        setLoading(true);
        try {
            let itemsToDisplay = [];
            let allActiveItems = [];
            
            if (filterView === 'deleted') {
                const response = await axios.get(DELETED_ITEMS_ENDPOINT, config);
                itemsToDisplay = response.data;
                
                const activeResponse = await axios.get(ACTIVE_ITEMS_ENDPOINT, config); 
                allActiveItems = activeResponse.data;
                
            } else {
                const activeResponse = await axios.get(ACTIVE_ITEMS_ENDPOINT, config); 
                allActiveItems = activeResponse.data;

                if (filterView === 'all') {
                    itemsToDisplay = allActiveItems.filter(item => item.status !== 'Finished');
                } else if (filterView === 'favorites') {
                    itemsToDisplay = allActiveItems.filter(item => item.is_favorite);
                } else if (filterView === 'finished') { 
                    itemsToDisplay = allActiveItems.filter(item => item.status === 'Finished');
                }
            }

            const allIncompleteActiveItems = allActiveItems.filter(item => item.status !== 'Finished');
            const hoursSum = allIncompleteActiveItems.reduce((sum, item) => 
                sum + parseFloat(item.time_hours || 0), 0); 
            setTotalHours(hoursSum.toFixed(2));
            
            if (filterView !== 'deleted') {
                itemsToDisplay.sort((a, b) => b.is_favorite - a.is_favorite); 
            }
            setMediaItems(itemsToDisplay);
            
        } catch (error) {
            console.error("Error fetching media items:", error.response ? error.response.data : error.message);
            Alert.alert("Error", "Could not load data. Check your network connection or if your token is expired/invalid.");
            setMediaItems([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchMediaItems();
        }
    }, [isFocused, filterView, userInfo?.token]); 

    if (loading) {
        return <ActivityIndicator size="large" style={[styles.loading, {backgroundColor: theme.background}]} />;
    }
    
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.item, 
                { 
                    backgroundColor: theme.card, 
                    borderRadius: theme.radius * 1.5, // Increased corner radius
                    marginVertical: theme.unit + 2, // More vertical space
                },
                styles.cardShadow,
                { 
                    borderLeftColor: getItemColor(item.media_type),
                    borderLeftWidth: theme.unit, // Thicker left border
                },
                item.status === 'Finished' && (themeName === 'dark' ? styles.itemFinishedDark : styles.itemFinished), 
                filterView === 'deleted' && (themeName === 'dark' ? styles.itemDeletedDark : styles.itemDeleted), 
            ]}
            onPress={() => {
                if (filterView === 'deleted') {
                    handleRestore(item.id);
                } else if (filterView === 'finished') {
                    handleUnmarkFinished(item.id);
                } else {
                    navigation.navigate('MediaEdit', { itemId: item.id })
                }
            }}
        >
            <View style={styles.itemContent}>
                <Text style={[
                    styles.itemTitle, 
                    { 
                        color: theme.text, 
                        fontSize: theme.fonts.heading, 
                    }, 
                    filterView === 'deleted' && styles.titleDeleted,
                    item.status === 'Finished' && filterView !== 'deleted' && styles.titleFinished 
                ]}>
                    {item.title} {item.is_favorite && filterView !== 'favorites' ? '⭐' : ''}
                </Text>
                <View style={styles.detailsAndActions}>
                    <Text style={[styles.itemDetails, { color: theme.subtext, fontSize: theme.fonts.body }]}>
                        {item.media_type} - 
                        {item.time_hours} hrs 
                        {item.status === 'Finished' && filterView !== 'finished' && filterView !== 'deleted' && <Text style={styles.finishedBadge}> (DONE)</Text>}
                    </Text>
                    
                    {/* ACTION BUTTONS: Only show specific action buttons in their views */}
                    <View style={styles.actionButtonsContainer}>
                        
                        {/* RESTORE BUTTON (Only visible in Trash) */}
                        {filterView === 'deleted' && (
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleRestore(item.id); }} style={[styles.restoreButton, { paddingVertical: theme.unit * 0.75, paddingHorizontal: theme.unit * 1.5 }]}>
                                <Text style={[styles.restoreButtonText, { fontSize: theme.fonts.small }]}>Restore</Text>
                            </TouchableOpacity>
                        )}
                        
                        {/* UNMARK FINISHED BUTTON (Only visible in Finished) */}
                        {filterView === 'finished' && (
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleUnmarkFinished(item.id); }} style={[styles.unmarkButton, { paddingVertical: theme.unit * 0.75, paddingHorizontal: theme.unit * 1.5 }]}>
                                <Text style={[styles.unmarkButtonText, { fontSize: theme.fonts.small }]}>Unmark Done</Text>
                            </TouchableOpacity>
                        )}

                        {/* UNFAVORITE BUTTON (Only visible in Favorites) */}
                        {filterView === 'favorites' && (
                            <TouchableOpacity 
                                onPress={(e) => { 
                                    e.stopPropagation(); 
                                    handleFavoriteToggle(item.id, item.is_favorite); 
                                }} 
                                style={[
                                    styles.unfavoriteButton, 
                                    { paddingVertical: theme.unit * 0.75, paddingHorizontal: theme.unit * 1.5 }
                                ]}
                            >
                                <Text style={[styles.unfavoriteButtonText, { fontSize: theme.fonts.small }]}>Unfavorite</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            
            {/* --- TOP HEADER BAR: Burden + Theme Toggle + LOGOUT --- */}
            <View style={[styles.topHeaderBar, {backgroundColor: theme.warning}]}>
                <Text style={[
                    styles.burdenText, 
                    { 
                        color: theme.text,
                        fontSize: theme.fonts.body,
                    }
                ]}>
                    Binge-Watching Burden: {totalHours} hours remaining 😩
                </Text>
                
                {/* Theme Toggle Button */}
                <TouchableOpacity 
                    onPress={toggleTheme} 
                    style={[styles.themeToggleButton, { backgroundColor: theme.subtext }]}
                >
                    <Text style={[styles.themeToggleText, { fontSize: theme.fonts.small }]}>
                        {themeName === 'light' ? '☀️ Day' : '🌙 Night'}
                    </Text>
                </TouchableOpacity>
                
                {/* LOGOUT BUTTON */}
                <TouchableOpacity 
                    onPress={logout} 
                    style={[styles.logoutButton, { backgroundColor: theme.error }]}
                >
                    <Text style={[styles.logoutButtonText, { fontSize: theme.fonts.small }]}>
                        Logout
                    </Text>
                </TouchableOpacity>
            </View>
            {/* ------------------------------------------ */}
            
            {/* FILTER BUTTONS UI */}
            <View style={[styles.filterContainer, { backgroundColor: theme.background, borderBottomColor: theme.border, paddingVertical: theme.unit }]}>
                {['all', 'finished', 'favorites', 'deleted'].map(view => (
                    <TouchableOpacity 
                        key={view}
                        style={[
                            styles.filterButton, 
                            { 
                                backgroundColor: theme.subtext, 
                                borderRadius: theme.radius * 2, 
                                marginHorizontal: theme.unit / 2, 
                            }, 
                            filterView === view && [styles.filterActive, { 
                                backgroundColor: view === 'deleted' ? theme.error : view === 'finished' ? MEDIA_TYPE_COLORS['TV Show'] : theme.activeFilter 
                            }]
                        ]}
                        onPress={() => setFilterView(view)}
                    >
                        <Text style={[styles.filterText, { 
                            color: filterView === view ? theme.card : theme.text, // Active text is theme.card (usually white/dark)
                            fontSize: theme.fonts.small 
                        }]}>
                            {view === 'all' ? 'To Watch' : 
                             view === 'finished' ? 'Finished ✅' :
                             view === 'favorites' ? 'Favorites ⭐' : 'Trash 🗑️'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {/* END FILTER BUTTONS UI */}
            
            <FlatList
                data={mediaItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: theme.padding / 2, paddingBottom: ADD_BUTTON_SIZE * 1.5 }} // Added space at the bottom for the Add button
                ListEmptyComponent={
                    <Text style={[styles.emptyText, { color: theme.subtext, marginTop: theme.padding, fontSize: theme.fonts.body }]}>
                        {filterView === 'deleted' ? "Your trash bin is empty." : 
                         filterView === 'finished' ? "No items marked as finished." :
                         "Nothing to watch! Add some media."}
                    </Text>
                }
            />
            
            {/* ADD BUTTON (Bigger and Better UI) */}
            <TouchableOpacity 
                style={[
                    styles.addButton, 
                    styles.cardShadow,
                    { 
                        right: theme.padding * 1.5, 
                        bottom: theme.padding * 1.5, 
                        width: ADD_BUTTON_SIZE, 
                        height: ADD_BUTTON_SIZE,
                        borderRadius: ADD_BUTTON_SIZE / 2, // Perfect circle
                        backgroundColor: '#FF6347', // A vibrant color (Tomato)
                    }
                ]}
                onPress={() => navigation.navigate('MediaAdd')}
            >
                <Text style={[styles.addButtonText, { fontSize: theme.fonts.heading + 10 }]}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 }, 
    loading: { flex: 1, justifyContent: 'center' },
    
    // --- SHADOW STYLES ---
    cardShadow: Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 }, // Slightly stronger shadow
        android: { elevation: 4 }, // Stronger elevation
        default: { boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }
    }),

    // --- LIST ITEM STYLES ---
    item: { 
        padding: 12, // Increased padding
    },
    itemFinished: { backgroundColor: '#e0f7fa', opacity: 0.9 }, 
    itemDeleted: { backgroundColor: '#fbebed', borderLeftColor: '#DC3545' }, 
    itemFinishedDark: { backgroundColor: '#004d40', opacity: 0.9 }, 
    itemDeletedDark: { backgroundColor: '#5c1717', borderLeftColor: '#DC3545' }, 

    itemContent: { flexDirection: 'column', justifyContent: 'space-between', width: '100%' },
    itemTitle: { fontWeight: 'bold' },
    titleDeleted: { textDecorationLine: 'line-through', color: '#DC354599' },
    titleFinished: { fontStyle: 'italic', opacity: 0.7 },
    
    detailsAndActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }, 
    actionButtonsContainer: { flexDirection: 'row', gap: 8 }, // Use gap for spacing between action buttons
    
    finishedBadge: { fontWeight: 'bold', color: '#A5D6A7', marginLeft: 4 },
    restoreButton: { backgroundColor: '#FFC107', borderRadius: 4 }, 
    restoreButtonText: { color: '#000', fontWeight: 'bold' },
    unmarkButton: { backgroundColor: '#6C757D', borderRadius: 4 }, 
    unmarkButtonText: { color: '#fff', fontWeight: 'bold' },
    unfavoriteButton: { backgroundColor: '#D9534F', borderRadius: 4 }, 
    unfavoriteButtonText: { color: '#fff', fontWeight: 'bold' },


    // --- HEADER STYLES ---
    topHeaderBar: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 8,
        // The background color is theme.warning, which acts as the main background for the bar
    },
    burdenText: { 
        textAlign: 'center', 
        fontWeight: '700', 
        flex: 1, // Allows burden text to take up most of the space
        marginRight: 8 // Space before buttons
    }, 
    themeToggleButton: { 
        paddingVertical: 4, 
        paddingHorizontal: 8, 
        borderRadius: 20,
        marginRight: 8 // Space between theme toggle and logout
    },
    themeToggleText: { color: '#fff', fontWeight: 'bold' },
    
    logoutButton: { 
        paddingVertical: 4, 
        paddingHorizontal: 8, 
        borderRadius: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    
    filterContainer: { 
        flexDirection: 'row', 
        justifyContent: 'center', // Centered filter buttons
        flexWrap: 'wrap', // Allows buttons to wrap on small screens
        borderBottomWidth: 1,
        marginBottom: 4,
    },
    filterButton: { paddingVertical: 8, paddingHorizontal: 12 }, // Increased button padding
    filterActive: { }, 
    filterText: { fontWeight: 'bold' }, 
    
    // --- ADD BUTTON STYLES (ENHANCED) ---
    addButton: { 
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 10,
        ...Platform.select({
            default: { cursor: 'pointer' },
        }),
    },
    addButtonText: { 
        color: '#fff', 
        fontWeight: 'bold',
        // Font size is set dynamically based on theme.fonts.heading + 10
    },
    emptyText: { textAlign: 'center' }
});

export default MediaList;