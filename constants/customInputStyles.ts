// components/auth/styles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  formContainer: {
    marginTop: 50,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 18,
  },

  googleButtonText: {
    color: Colors.white,
    marginLeft: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[300],
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: Colors.gray[500],
  },

  // Input-related styles
  inputContainer: {
    marginBottom: 20, // Add margin for spacing between inputs
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 5,
  },
  inputField: {
    backgroundColor: Colors.gray[100],
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.black,
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  inputFieldFocused: {
    borderColor: Colors.primary, // Highlight border when input is focused
  },

    inputError: {
        borderColor: Colors.error,
    },
    errorText: {
        fontSize: 12,
        color: Colors.error,
        marginTop: 5,
    },

    
    });