// ... (Component code remains the same above the StyleSheet)

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 25, // Increased outer padding
    },
    loading: { flex: 1, justifyContent: 'center' },
    
    // --- Confirmation Box (Card) Styles ---
    contentBox: {
        padding: 35, // More padding for a premium feel
        borderRadius: 16, // Softer, modern corners
        borderWidth: 1,
        width: '100%', 
        maxWidth: 400, 
        alignItems: 'center',
        
        // Stronger shadow to make it pop like a modal/alert
        ...Platform.select({
            ios: { 
                shadowColor: "#000", 
                shadowOffset: { width: 0, height: 6 }, // Deeper shadow
                shadowOpacity: 0.15, // Slightly higher opacity
                shadowRadius: 15 
            },
            android: { elevation: 8 },
        }),
    },

    // --- Text Styles ---
    warningText: {
        fontSize: 20, // Slightly larger
        fontWeight: '900', // Very bold
        textAlign: 'center',
        marginBottom: 8, // Less margin to keep it close to the title
        textTransform: 'uppercase',
    },
    itemIdText: {
        textAlign: 'center',
        marginBottom: 35, // More space before the buttons
        fontSize: 22, // Larger font size for the item title
        fontWeight: 'bold',
    },

    // --- Button Styles ---
    actionButton: {
        width: '100%',
        paddingVertical: 14, // Consistent padding
        borderRadius: 12, // Match Login/Register buttons
        alignItems: 'center',
        marginTop: 15,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700', // Bold
        fontSize: 18, // Larger font size for action buttons
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    
    // Specific Colors (Kept for clarity)
    deleteButton: {
        backgroundColor: '#DC3545', // Danger Red
        // Add subtle shadow to the primary action button
        ...Platform.select({
            ios: { 
                shadowColor: '#DC3545', 
                shadowOffset: { width: 0, height: 3 }, 
                shadowOpacity: 0.4, 
                shadowRadius: 5 
            },
            android: { elevation: 5 },
        }),
    },
    cancelButton: {
        backgroundColor: '#6C757D', // Secondary Grey
        marginTop: 10, // Less separation from the delete button
    },
});

export default MediaDelete;