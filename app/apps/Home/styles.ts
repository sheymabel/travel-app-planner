
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    scrollContent: {
      paddingBottom: 100, // Space for bottom nav
    },
    subHeader: {
      fontSize: 16,
      color: '#3F566EFF',
      fontWeight: '500',
      marginTop: 10,
      marginLeft: 20,
    },
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#1C1C1E',
      marginLeft: 20,
      marginBottom: 20,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 25,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 30,
      paddingHorizontal: 15,
      paddingVertical: 12,
      marginRight: 10,
      borderWidth: 1.5,
      borderColor: '#007AFF',
      shadowColor: "#007AFF",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: '#1C1C1E',
    },
    filterButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 50, // Make it circular
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#007AFF",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 6,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1C1C1E',
      marginLeft: 20,
      marginBottom: 15,
      marginTop: 10,
    },
    horizontalScroll: {
      paddingLeft: 20,
      paddingRight: 10, // To show a bit of the next card
      paddingBottom: 10, // Add padding for shadow visibility
    },
    card: {
      height: 250,
      borderRadius: 20,
      marginRight: 16,
      overflow: 'hidden', // Ensures image corners are rounded
      backgroundColor: '#f0f0f0', // Placeholder background
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 5,
    },
    cardImage: {
      flex: 1,
      justifyContent: 'flex-end', // Align content to bottom
    },
    cardImageStyle: {
      borderRadius: 20,
    },
    cardOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text visibility
      padding: 15,
      borderBottomLeftRadius: 20, // Match parent rounding
      borderBottomRightRadius: 20,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5,
    },
    cardBottomRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    cardPrice: {
      fontSize: 14,
      color: '#E0E0E0', // Lighter text for price
    },
    cardRating: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 10,
    },
    cardRatingText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginRight: 4,
    },
    smallCard: {
      height: 200,
      borderRadius: 20,
      marginRight: 16,
      overflow: 'hidden',
      backgroundColor: '#f0f0f0',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    smallCardImage: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    smallCardImageStyle: {
       borderRadius: 20,
    },
    smallCardOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: 12,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    smallCardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 3,
    },
    smallCardLocations: {
      fontSize: 13,
      color: '#E0E0E0',
    },
    bottomNav: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 75, // Increased height for better touch area
      backgroundColor: '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
      paddingBottom: 15, // Padding for safe area bottom inset
      paddingTop: 10,
      shadowColor: "#000", // Add shadow for elevation effect
      shadowOffset: {
        width: 0,
        height: -2, // Shadow upwards
      },
      shadowOpacity: 0.05,
      shadowRadius: 3.84,
      elevation: 5,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    
  });
  