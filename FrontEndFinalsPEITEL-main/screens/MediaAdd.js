// ... (Component code remains the same)

// Final refined styles
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        paddingHorizontal: 20, // Increased horizontal padding
        paddingVertical: 30,
    },
    loading: { 
        flex: 1, 
        justifyContent: 'center' 
    },
    
    // --- New Card Styles (Applies to the form itself) ---
    form: { 
        width: '100%', 
        maxWidth: 400, // Slightly wider for tablets/desktop
        alignSelf: 'center', 
        padding: 25, // Generous padding inside the card
        borderRadius: 16, // Rounded corners for the card
        // Note: The background color should be applied inline using theme.card
        
        // Use the existing shadow for consistency
        ...Platform.select({
            ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
            android: { elevation: 6 },
            default: { boxShadow: '0 4px 10px rgba(0,0,0,0.1)' } 
        }),
    },
    
    // The previous cardShadow is now only used for the Favorite button, renamed for clarity
    cardShadow: Platform.select({
        ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
        android: { elevation: 3 },
        default: { boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } 
    }),
    
    title: {
        fontWeight: '900', // Extra bold title
        textAlign: 'center',
        marginBottom: 25, // More space below the title
    },
    
    // --- Input & Label Styles ---
    label: { 
        fontWeight: '600', 
        marginTop: 15, // Increased margin before label
        marginBottom: 5, 
    },
    input: {
        // height: 30 is too small, use paddingVertical instead
        paddingVertical: 12, // Generous vertical padding for height
        paddingHorizontal: 15,
        borderRadius: 12, // Modern, soft corners
        borderWidth: 1,
        marginBottom: 10, // Increased margin after input
    },
    
    // --- Picker Styles ---
    pickerWrapper: {
        // height: 30 is too small, use paddingVertical instead
        paddingVertical: 0, // Padding is managed by the Picker itself on native
        borderRadius: 12, // Match input corners
        borderWidth: 1,
        overflow: 'hidden', 
        marginBottom: 10,
    },
    pickerStyle: {
        width: '100%',
        height: Platform.OS === 'ios' ? 120 : 45, // Set realistic height for native controls
        // On iOS, the Picker needs more height to display a wheel; Android/Web is fine with less.
    },
    
    // --- Action Button Styles ---
    actionButton: {
        alignItems: 'center',
        paddingVertical: 15, // Consistent vertical padding
        borderRadius: 12, // Match input/card corners
        marginTop: 15, // More separation from inputs
        ...Platform.select({
            default: { cursor: 'pointer' },
        }),
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700', // Bold
        textTransform: 'uppercase',
    },

    // --- Favorite Button Styles ---
    favoriteButton: {
        paddingVertical: 10, // Increased padding
        borderRadius: 12, // Match other components
        alignItems: 'center',
        marginBottom: 20, // More separation from the title/inputs
        borderWidth: 1,
    },
    favoriteActive: {
        backgroundColor: '#FFD700', // Gold color
        borderColor: '#FFD700',
    },
    favoriteButtonText: {
        fontWeight: '700',
    },

    // --- Specific Button Colors (Kept external to styles) ---
    saveButton: {
        backgroundColor: '#28A745', // Success Green
    },
    cancelButton: {
        backgroundColor: '#6C757D', 
        marginTop: 10, // Slightly less margin for the secondary action
    },
});

export default MediaAdd;