import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8FAFC'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1E293B'
  },
  formContainer: {
    flex: 1,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#D1D5DB',
  borderRadius: 8,
  marginBottom: 16,
  overflow: 'hidden',
},
picker: {
  height: 50,
  width: '100%',
},

  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageUploadText: {
    color: '#3B82F6',
    fontWeight: '500',
    marginTop: 8,
  },
  inputLabel: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 24,
  },
  priceDurationRow: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});