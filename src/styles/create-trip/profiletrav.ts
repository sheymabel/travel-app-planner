import { StyleSheet } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default   StyleSheet.create({
  
  // Container Styles
  safeArea: {
    flex: 1,

  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
   inner: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: '600',
    color: Colors.gray[800], // Approximating #212529
    marginBottom: 12,
  },
  // Loading State
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,    
  },
  
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#e9ecef',
  },
  
  
  
  // Text Styles
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  
  // Navigation Tabs
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4263eb',
  },
  tabText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4263eb',
    fontWeight: '600',
  },
  
  // Content Cards
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileBio: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 12,
  },
  
  // Favorites Section
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  favoriteText: {
    fontSize: 15,
    color: '#495057',
    marginLeft: 12,
  },
  
  // Empty States
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#6c757d',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#adb5bd',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  
  editButton: {
   backgroundColor: '#4263eb',
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
 alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  marginTop: 10,         // space above the button
  marginBottom: 30,      // space below the button
  marginHorizontal: 99,  // horizontal spacing (left & right)
  width: '50%',
  shadowColor: '#4263eb',
  shadowOffset: { width: 1, height: 5 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Settings Section
  settingsSection: {
    marginTop: 1,
    marginBottom: 5,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
    paddingLeft: 8,
  },
  menuGroup: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  menuItemIcon: {
    width: 24,
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    color: '#343a40',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    padding: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#495057',
  },
  modalClose: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#4263eb',
    fontWeight: '600',
  },
  
  // Utility Styles
  divider: {
    height: 1,
    backgroundColor: '#f1f3f5',
    marginVertical: 8,
  },
  errorText: {
    textAlign: 'center',
    color: '#fa5252',
    fontSize: 16,
    marginTop: 20,
  },
});