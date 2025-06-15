import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 24,
        fontWeight: 'bold',
    color: '#111827',
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
},
emptyState: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 20
},
emptyStateText: {
  fontSize: 16,
  color: '#6B7280',
  marginVertical: 16
},
serviceInfo: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 16
},
serviceImage: {
  width: 80,
  height: 80,
  borderRadius: 8,
  marginRight: 16
},
serviceDetails: {
  flex: 1
},
priceDurationContainer: {
  flexDirection: 'row',
  marginTop: 8
},
priceText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#111827',
  marginRight: 16
},
durationText: {
  fontSize: 14,
  color: '#6B7280'
},
  addButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  activeStatusText: {
    color: '#059669',
  },
  inactiveStatusText: {
    color: '#DC2626',
  },
  editButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  serviceDescription: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  servicePrice: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  serviceCategory: {
    color: '#6B7280',
    fontSize: 14,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  serviceTime: {
    color: '#6B7280',
    fontSize: 14,
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    color: '#1F2937',
    fontSize: 14,
    marginLeft: 4,
  },
  reviewsText: {
    color: '#6B7280',
    fontSize: 14,
  },
  imageContainer: {
    marginBottom: 16,
  },
 
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
  },
  modalIconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalText: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  confirmDeleteButton: {
    backgroundColor: '#FEE2E2',
  },
 
  loadingText: {
    marginTop: 16,
    color: '#4B5563',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  addEmptyButton: {
    marginTop: 20,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addEmptyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});