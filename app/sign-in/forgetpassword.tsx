import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  sendPasswordResetEmail,
  confirmPasswordReset,
  AuthErrorCodes,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { auth } from '../../configs/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const db = getFirestore();

export default function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const checkEmailInCollections = async (email: string) => {
    const collections = ['business', 'Travler'];
    for (const name of collections) {
      const ref = collection(db, name);
      const q = query(ref, where('email', '==', email));
      const snap = await getDocs(q);
      if (!snap.empty) return true;
    }
    return false;
  };

  const handleRequestReset = async () => {
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Enter a valid email', 'error');
      return;
    }

    setLoading(true);
    try {
      const exists = await checkEmailInCollections(email);
      if (!exists) {
        showToast('Email not found in our records', 'error');
        return;
      }

      await sendPasswordResetEmail(auth, email);
      showToast('Reset email sent. Check your inbox.');
      Alert.alert('Reset Sent', 'Check your email and paste the reset code below.', [
        { text: 'OK', onPress: () => setActiveTab('reset') },
      ]);
    } catch (error: any) {
      let msg = 'Error sending reset email';
      if (error.code === AuthErrorCodes.INVALID_EMAIL) msg = 'Invalid email';
      else if (error.code === AuthErrorCodes.USER_DELETED) msg = 'User not found';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!resetCode || !newPassword) {
      showToast('Please enter reset code and new password', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(auth, resetCode, newPassword);
      showToast('Password reset successful!');
      Alert.alert('Done', 'Your password has been changed.', [
        { text: 'Go to login', onPress: () => router.replace('/sign-in') },
      ]);
    } catch (error: any) {
      let msg = 'Reset failed';
      if (error.code === AuthErrorCodes.INVALID_OOB_CODE)
        msg = 'Invalid or expired reset code';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => router.replace('/sign-in')}
        style={{ marginTop: 40, padding: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View style={styles.inner}>
        <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'request' && styles.activeTab]}
            onPress={() => setActiveTab('request')}
          >
            <Text style={[styles.tabText, activeTab === 'request' && styles.activeTabText]}>
              Request Reset
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'reset' && styles.activeTab]}
            onPress={() => setActiveTab('reset')}
          >
            <Text style={[styles.tabText, activeTab === 'reset' && styles.activeTabText]}>
              Confirm Code
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'request' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                   placeholderTextColor={Colors.gray[400]} 
                  placeholder="Please Enter your Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={handleRequestReset}
              style={[styles.resetButton, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.resetButtonText}>Send Reset Email</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.subtitle}>Enter the reset code and your new password.</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reset Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reset code"
                autoCapitalize="none"
                value={resetCode}
                onChangeText={setResetCode}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <TouchableOpacity
              onPress={handleConfirmReset}
              style={[styles.resetButton, loading && styles.buttonDisabled]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.resetButtonText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { padding: 20, marginTop: 40 },
  title: {    fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: Colors.primary, },
  subtitle: { fontSize: 16, marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    outlineWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
  },
  resetButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: 'center',
    borderRadius: 12,
  },
  resetButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: Colors.primary,
  },
   header: {
    alignItems: 'center',

    paddingBottom: 30,
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  inputIcon: {
    marginRight: 12,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});
