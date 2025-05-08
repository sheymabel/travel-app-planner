import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions, Linking,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../../configs/FirebaseConfig';
import Toast from 'react-native-toast-message';
import { doc, getDoc } from 'firebase/firestore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { Traveler } from '../../../../models/Traveler';
import { Business } from '../../../../models/BusinnessOwner';
const { height } = Dimensions.get('window');
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
          onPress={() => router.replace('/scre/Screen1')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      ),
    });
    const openGoogle = () => {
      Linking.openURL('https://www.google.com'); // Opens the Google URL in the default browser
    };
    // Animate header
    headerOpacity.value = withTiming(1, { duration: 500 });
    headerTranslateY.value = withSpring(0, { damping: 10 });

    // Animate form
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
  
      console.log('User UID:', user.uid); // Debugging UID
  
      const userTRef = doc(db, 'Travler', user.uid);
      const userBRef = doc(db, 'business', user.uid);
  
      // On vérifie s'il est dans la collection 'Travler'
      let userSnap = await getDoc(userTRef);
      let isTraveler = true;
  
      if (!userSnap.exists()) {
        // Sinon on vérifie 'business'
        userSnap = await getDoc(userBRef);
        isTraveler = false;
      }
  
      if (!userSnap.exists()) {
        showToast('No user data found', 'error');
        return;
      }
  
      const userData = userSnap.data();
  
      // Redirection basée sur la collection d'origine
      if (isTraveler) {
        await router.replace('/apps/traveler/trips');
      } else {
        await router.replace('/apps/business-owner/HomeBusiness');
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
  
  const openGoogle = () => {
    Linking.openURL('https://mail.google.com'); // Open the Google URL
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
       <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          onPress={() => router.replace('/App')}
          style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>
      </Animated.View>

      <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
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

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
        <TouchableOpacity 
      style={styles.socialButton}
      onPress={openGoogle}  // Add the onPress event to open Google
    >
      <Ionicons name="logo-google" size={24} color="black" />  {/* Google Icon */}
    </TouchableOpacity>
         
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('./auth/sign-up')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
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
    borderColor: Colors.black, // changed to black
    backgroundColor: Colors.white,

  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  signInButton: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    width: '60%',
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
    marginHorizontal: 16,
    color: Colors.gray[500],
    fontSize: 14,
  },
  inner: {
    marginTop: 20,
    paddingTop: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  signUpText: {
    color: Colors.gray[600],
    fontSize: 14,
  },
  signUpLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    justifyContent: 'center',
alignItems: 'center',

  },
  backButton: {
    marginLeft: 16,
    padding: 8,
    borderRadius: 8,
    width: '60%',

  },
});
