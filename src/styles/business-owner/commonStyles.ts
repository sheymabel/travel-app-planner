import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#3B82F6',
  danger: '#DC2626',
  success: '#10B981',
  background: '#F8FAFC',
  text: '#1E293B',
  muted: '#64748B'
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background
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
    color: colors.text
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: colors.primary
  },
  dangerButton: {
    backgroundColor: colors.danger
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 16
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16
  }
});