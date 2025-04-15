import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../../configs/FirebaseConfig';
import { Colors } from '../../../constants/Colors';

export default function SignInScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = async (uid: string): Promise<string | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'AuthUser', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return (userData?.role ?? null)?.toString().trim(); // normalize
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to fetch user role',
      });
    }
    return null;
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Info',
        text2: 'Email and password required',
      });
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      const role = await fetchUserRole(user.uid);
      console.log('Fetched user role:', role);

      if (!role) {
        throw new Error('Role not found in database.');
      }

      switch (role.toLowerCase()) {
        case 'business-owner':
          router.replace('/BusinessOwner/HomeBusiness');
          break;
        case 'traveler':
          router.replace('/(tabs)/mytrip');
          break;
        default:
          throw new Error(`Unrecognized role: ${role}`);
      }

      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
      });

    } catch (err: any) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Access your account</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor={Colors.Gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={Colors.Gray}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/auth/sign-up')}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Don’t have an account? <Text style={styles.link}>Register</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  );
}

  container: {
    flex: 1,
    backgroundColor: Colors.white,
  } as ViewStyle,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    textAlign: 'center',
    color: Colors.light.text,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 16,
    textAlign: 'center',
    color: Colors.Gray,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    fontFamily: 'outfit',
    borderWidth: 1,
    borderColor: Colors.Gray,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    color: Colors.Gray,
  },
  button: {
    backgroundColor: Colors.Primary,
    paddingVertical: 16,
    borderRadius: 15,
    marginTop: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.Gray,
  },
  buttonText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.white,
  },
  linkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: Colors.Gray,
  },
  link: {
    color: Colors.Primary,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: 'red',
    fontFamily: 'outfit',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});
