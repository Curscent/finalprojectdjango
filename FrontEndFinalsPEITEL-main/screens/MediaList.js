// ... (Component code remains the same above the StyleSheet)

const styles = StyleSheet.create({
    container: { flex: 1 }, 
    loading: { flex: 1, justifyContent: 'center' },
    
    // --- SHADOW STYLES (Stronger for modern cards) ---
    cardShadow: Platform.select({
        // Higher elevation for better pop-out effect
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 }, 
        android: { elevation: 6 }, 
        default: { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }
    }),

    // --- LIST ITEM STYLES ---
    item: { 
        padding: 15, // Increased padding for more internal space
    },
    // The background is theme.card, but we override for finished/deleted states
    itemFinished: { backgroundColor: '#E8F5E9', opacity: 0.95 }, // Very light green/blue for light theme finished
    itemDeleted: { backgroundColor: '#FCE4EC', borderLeftColor: '#DC3545' }, // Very light pink for light theme deleted
    itemFinishedDark: { backgroundColor: '#004D40', opacity: 0.95 }, // Dark green for finished
    itemDeletedDark: { backgroundColor: '#4E0E0E', borderLeftColor: '#DC3545' }, // Dark red for deleted

    itemContent: { flexDirection: 'column', justifyContent: 'space-between', width: '100%' },
    itemTitle: { fontWeight: '700' }, // Bolder title
    titleDeleted: { textDecorationLine: 'line-through', color: '#DC354599' },
    titleFinished: { fontStyle: 'italic', opacity: 0.6 }, // Lighter text for finished items
    
    detailsAndActions: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 6 // More separation from title
    }, 
    actionButtonsContainer: { flexDirection: 'row', gap: 10 }, 
    
    finishedBadge: { fontWeight: 'bold', color: '#4CAF50', marginLeft: 4 }, // Stronger green for badge
    
    // Action Buttons in list item (Made more distinct)
    restoreButton: { backgroundColor: '#FFD700', borderRadius: 8, ...Platform.select({default: { cursor: 'pointer' }}) }, // Gold color
    restoreButtonText: { color: '#000', fontWeight: '700' },
    unmarkButton: { backgroundColor: '#607D8B', borderRadius: 8, ...Platform.select({default: { cursor: 'pointer' }}) }, // Blue-Grey for Unmark
    unmarkButtonText: { color: '#fff', fontWeight: '700' },
    unfavoriteButton: { backgroundColor: '#B00020', borderRadius: 8, ...Platform.select({default: { cursor: 'pointer' }}) }, // Stronger Red for Unfavorite
    unfavoriteButtonText: { color: '#fff', fontWeight: '700' },


    // --- HEADER STYLES ---
    topHeaderBar: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Spread elements out
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#FF6F0055', // Subtle divider
    },
    burdenText: { 
        fontWeight: '900', // Extra bold
        flex: 1, 
        paddingRight: 10,
    }, 
    themeToggleButton: { 
        paddingVertical: 6, 
        paddingHorizontal: 10, 
        borderRadius: 20,
        marginRight: 10,
    },
    themeToggleText: { color: '#fff', fontWeight: '700' },
    
    logoutButton: { 
        paddingVertical: 6, 
        paddingHorizontal: 10, 
        borderRadius: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: '700'
    },
    
    // --- FILTER BUTTON STYLES (Pill/Tab Style) ---
    filterContainer: { 
        flexDirection: 'row', 
        justifyContent: 'flex-start', // Align to start (better for wrapping)
        flexWrap: 'wrap', 
        borderBottomWidth: 0, // Remove line under filters
        paddingHorizontal: 10,
        paddingVertical: 10,
        // Optional: Add a subtle shadow to the filter bar if needed
    },
    filterButton: { 
        paddingVertical: 8, 
        paddingHorizontal: 14, // Wider pills
        borderRadius: 25, // True pill shape
        marginHorizontal: 5, 
        marginBottom: 8, // Space between wrapped rows
        ...Platform.select({default: { cursor: 'pointer' }}),
    },
    filterActive: { 
        // No specific background color needed here, as it is applied in the component code 
        // to handle the special cases (deleted/finished)
    }, 
    filterText: { fontWeight: '700' }, 
    
    // --- ADD BUTTON STYLES (ENHANCED) ---
    addButton: { 
        position: 'absolute', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 10,
        ...Platform.select({default: { cursor: 'pointer' }}),
    },
    addButtonText: { 
        color: '#fff', 
        fontWeight: '900', // Extra bold plus sign
    },
    emptyText: { textAlign: 'center' }
});

export default MediaList;