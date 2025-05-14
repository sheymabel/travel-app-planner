// app/auth/BusinessOwner/styles/BusinessReviewsStyles.ts
import { StyleSheet } from 'react-native';

export const Styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  reviewItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  starContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 10,
  },
  replyContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
    padding: 10,
    borderRadius: 6,
  },
  replyLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 4,
  },
  replyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 19,
  },
  startReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#eef2ff',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  startReplyButtonText: {
    marginLeft: 6,
    color: '#4f46e5',
    fontWeight: '500',
    fontSize: 14,
  },
  replyInputContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  replyInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  replyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  replyButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#4f46e5',
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  submitButtonText: {
    color: '#fff',
  },
  errorText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 50,
  },
});
