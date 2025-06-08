import "../../configs/FirebaseConfig"; // Critical Firebase init
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../configs/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { doc, getDoc } from 'firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function SignIn() {
  const navigation = useNavigation();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace('/screens/Screen1')}
          style={{ marginTop: -50, padding: 8, borderRadius: 10 }} // Moved custom styling here
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
          <Text style={{ display: 'none' }}>Back Button</Text>
        </TouchableOpacity>
      ),
    });

    // Animation setup
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerTranslateY.value = withSpring(0, { damping: 10 });
    formOpacity.value = withTiming(1, { duration: 500 });
    formTranslateY.value = withSpring(0, { damping: 10 });
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const validateForm = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return false;
    }
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userTRef = doc(db, 'Travler', user.uid);
      const userBRef = doc(db, 'business', user.uid);

      let userSnap = await getDoc(userTRef);
      let isTraveler = true;

      if (!userSnap.exists()) {
        userSnap = await getDoc(userBRef);
        isTraveler = false;
      }

      if (!userSnap.exists()) {
        showToast('No user data found', 'error');
        return;
      }

      if (isTraveler) {
        await router.replace('/Trip/Serch-place');
      } else {
        await router.replace('/business-owner/HomeBusiness');
      }
      showToast('Sign in successful');
    } catch (error: any) {
      let msg = 'Something went wrong';
      if (error.code === 'auth/user-not-found') msg = 'No user found with this email';
      else if (error.code === 'auth/invalid-email') msg = 'Invalid email address';
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
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          onPress={() => router.replace('/screens/Screen1')}
          style={{ marginTop: 1, padding: 5 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />

        </TouchableOpacity>

        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Please enter your Email"
                placeholderTextColor={Colors.gray[400]} 
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Please enter your Password"
                secureTextEntry={!showPassword}
                 placeholderTextColor={Colors.gray[400]} 
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.gray[400]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            style={[styles.signInButton, loading && styles.signInButtonDisabled]}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Social Login */}
          <View style={styles.divider}>
          </View>
          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/sign-up')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signUpContainer}>
            <TouchableOpacity onPress={() => router.replace('/sign-in/forgetpassword')}>
              <Text style={{ textAlign: 'center', color: Colors.primary, fontWeight: '500' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

// Styles moved to new location in project structure
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    marginTop: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[800],
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderColor: Colors.gray[300],
    backgroundColor: Colors.white,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    outlineWidth:0,
  
  },
  eyeIcon: {
    padding: 8,
  },
  signInButton: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[300],
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.gray[500],
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  socialButton: {
    marginTop: 30,
    marginHorizontal: 12,
    padding: 10,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    fontSize: 15,
    fontWeight: '500',
  },
  signUpLink: { 
   color: Colors.primary,
    fontSize: 15,
    fontWeight: '500',
  },
});
