import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Timestamp } from 'firebase/firestore';
import { db, auth } from '../../configs/FirebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Category } from '../../models/BusinnessOwner';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function businessRegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(30);

  const isFormValid =
    fullName && email && phone && address && password && description && category;

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace('/sign-up')}
          style={styles.backButton}
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

  function showToast(message: string, type: string = 'success') {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{8,14}$/;

    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    if (!phoneRegex.test(phone)) {
      showToast('Please enter a valid phone number.', 'error');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, 'business', uid), {
        fullName,
        email,
        phone,
        address,
        description,
        category,
        password,
        createdAt: Timestamp.now(),
      });

      showToast('business registered successfully!');
      setLoading(false);
      router.replace('/sign-in');
    } catch (err: any) {
      console.error('Firebase error:', err);
      setLoading(false);

      if (err.code === 'auth/email-already-in-use') {
        showToast('Email already in use.', 'error');
      } else if (err.code === 'auth/weak-password') {
        showToast('Password is too weak.', 'error');
      } else {
        showToast('Registration failed. Please try again.', 'error');
      }
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/sign-in')}
        style={{ marginTop: 20, padding: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.title}>Register Your business</Text>
          <Text style={styles.subtitle}>Provide some details about your business</Text>
        </Animated.View>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={[styles.input, error.includes('name') && styles.inputError]}
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                placeholderTextColor={Colors.gray[400]}
                autoCapitalize="words"
              />
              </View>
            </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={[styles.input, error.includes('email') && styles.inputError]}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={[styles.input, error.includes('phone') && styles.inputError]}
                value={phone}
                onChangeText={setPhone}
                placeholder="1234567890"
                placeholderTextColor={Colors.gray[400]}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Address Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="location" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="123 business St, City"
                placeholderTextColor={Colors.gray[400]}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.gray[400]}
                secureTextEntry
              />
            </View>
            {password.length > 0 && (
              <Text style={[
                styles.passwordHint,
                password.length < 6 && styles.passwordHintWeak
              ]}>
                {password.length < 6
                  ? 'Password too short (min 6 characters)'
                  : 'Password strength looks good'}
              </Text>
            )}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="text" size={20} color={Colors.gray[600]} style={styles.icon} />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Tell us about your business..."
                placeholderTextColor={Colors.gray[400]}
                multiline
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value) => setCategory(value)}
                style={styles.picker}
                dropdownIconColor={Colors.gray[600]}
              >
                <Picker.Item label="Handmade Crafts" value="handmade_crafts" />
                <Picker.Item label="Traditional Clothing" value="traditional_clothing" />
                <Picker.Item label="Natural Cosmetics" value="natural_cosmetics" />
                <Picker.Item label="Leather Goods" value="leather_goods" />
                <Picker.Item label="Jewelry & Accessories" value="artisan_jewelry" />
                <Picker.Item label="Local Gastronomy" value="local_gastronomy" />
                <Picker.Item label="Artistic Creations" value="artistic_creations" />
                <Picker.Item label="Ceramics & Pottery" value="ceramics_pottery" />
                <Picker.Item label="Woven Goods" value="woven_goods" />
                <Picker.Item label="Carpentry & Woodwork" value="woodwork" />
                <Picker.Item label="Cultural Heritage Items" value="cultural_heritage" />


                {/* General */}
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.button, (!isFormValid || loading) && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.replace('/sign-in')}>
              <Text style={styles.signInLink}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Toast />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    marginTop: -40,
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[800],
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 10,
    paddingHorizontal: 10,

  },
  input: {
    flex: 1,
    height: 50,
    outlineWidth: 0,
    paddingLeft: 10,
    color: Colors.gray[800],
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.gray[400],
  },
  icon: {
    marginRight: 10,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingVertical: 15,
  },
  pickerContainer: {
    backgroundColor: Colors.gray[100],
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: Colors.gray[600],
    borderColor:Colors.gray[300],
    borderWidth:1,
    borderRadius:10,
    paddingHorizontal: 10,
  },
  passwordHint: {
    fontSize: 12,
    marginTop: 5,
    color: Colors.success,
  },
  passwordHintWeak: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray[400],
    shadowOpacity: 0,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: Colors.gray[600],
  },
  signInLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.primary,
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
});