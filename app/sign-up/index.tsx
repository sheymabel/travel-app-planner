import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../configs/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);

  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);
const AuthPath='/sign-in';
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace('/sign-in')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.black} />
        </TouchableOpacity>
      ),
    });

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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !selectedRole) {
      showToast('Please enter all details', 'error');
      return;
    }

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email', 'error');
      return;
    }

    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 6 characters with letters and numbers', 'error');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let userDoc;
      let redirectPath;

      if (selectedRole === 'Traveler') {
        userDoc = {
          uid: user.uid,
          fullName,
          email,
          password,
          
          
          //role: 'Traveler',
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'Travler', user.uid), userDoc);
      } else if (selectedRole === 'business') {
        userDoc = {
          uid: user.uid,
          fullName,
          email,
          password,
        //role: 'business',
          createdAt: new Date(),
        };
        await setDoc(doc(db, 'business', user.uid), userDoc);
        //redirectPath = '/auth/businessRegister'; // This can trigger full business setup
      } else {
        showToast('Invalid role selected.', 'error');
        return;
      }

      //await setDoc(doc(db, 'Travler', user.uid), userDoc);

      showToast('Sign up successful', 'success');
      redirectPath =AuthPath;
      router.replace('/sign-in');
    } catch (error: any) {
      console.error(error);
      let msg = 'Sign up failed';
      if (error.code === 'auth/email-already-in-use') msg = 'Email already in use';
      else if (error.code === 'auth/weak-password') msg = 'Weak password';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleButtonStyle = (role: string) => ({
    ...styles.roleButton,
    ...(selectedRole === role && styles.selectedRole),
  });

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
     <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          onPress={() => router.replace('/sign-in')}
          style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
       
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.title}>Create Account</Text>
      </Animated.View>

      <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={Colors.gray[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
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
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Role</Text>
          <View style={styles.roleButtonsContainer}>
            <TouchableOpacity
              onPress={() => setSelectedRole('Traveler')}
              style={getRoleButtonStyle('Traveler')}
            >
              <Text style={styles.roleButtonText}>Traveler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSelectedRole('business');
                router.replace('/business-register')
              }}
              style={getRoleButtonStyle('business')}
            >
              <Text style={styles.roleButtonText}>business</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/sign-in')}>
            <Text style={styles.signInLink}>Sign In</Text>
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 10,
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
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: 8,
  },
  input: {
    height: 50,
   
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  inner: {
    marginTop: 20,
    paddingTop: 10,
  },
  roleButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center', 
  },
  selectedRole: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderColor: Colors.primary,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
    marginVertical: 20,
    elevation: 5, // Shadow for Android
    shadowColor: Colors.black, // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  signInText: {
    color: Colors.gray[600],
    fontSize: 14,
  },
  signInLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    paddingLeft: 16,
  },
});
