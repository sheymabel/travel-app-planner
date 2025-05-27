import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';
export default   StyleSheet.create({
  // Main container styles
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  
  // Content area styles
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  
  // Title text styles
  title: {
    marginTop:-50,
    fontFamily: 'outfit-bold',
    fontSize: 28,
    color: Colors.bgColor,
    letterSpacing: 0.5,
  },
  
  // Add button container
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  
  // Add button text
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: 'outfit-medium',
  },
  
  // Empty state container
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  
  // Empty state text
  emptyText: {
    fontSize: 18,
    color: Colors.gray[500],
    fontFamily: 'outfit-regular',
    marginTop: 16,
    textAlign: 'center',
  },
  
  // Trip list container
  tripList: {
    marginTop: 8,
  },
  
  // Loading indicator style
  loadingIndicator: {
    marginTop: 32,
  },
  
  // Card shadow style (if you add trip cards later)
  cardShadow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }
});