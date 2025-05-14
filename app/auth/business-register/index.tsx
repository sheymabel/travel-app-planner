import React, { useState ,useEffect} from 'react';
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
import { Colors } from '../../../constants/Colors';
import {  Timestamp } from 'firebase/firestore';
import { db, auth } from '../../../configs/FirebaseConfig';
import { setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Category } from '../../../models/BusinnessOwner';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
export default function BusinessRegisterScreen() {
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
        onPress={() => router.replace('/auth/sign-up')}
        style={{ marginTop: -40, padding: 8, borderRadius: 10 }} // Moved custom styling here
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
        role: 'business',
        createdAt: Timestamp.now(),
      });

      showToast('Business registered successfully!');
      setLoading(false);
      router.replace('/auth/sign-in');
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          onPress={() => router.replace('./auth/sign-up')}
          style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Register Your Business</Text>
        <Text style={styles.subtitle}>Provide some details about your business</Text>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        {/* Full Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color={Colors.gray[600]} style={styles.icon} />
            <TextInput
              style={[styles.input, error.includes('name') && { borderColor: 'red' }]}
              value={fullName}
              onChangeText={setFullName}
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
              style={[styles.input, error.includes('email') && { borderColor: 'red' }]}
              value={email}
              onChangeText={setEmail}
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
              style={[styles.input, error.includes('phone') && { borderColor: 'red' }]}
              value={phone}
              onChangeText={setPhone}
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
              secureTextEntry
            />
          </View>
          {password.length > 0 && (
            <Text
              style={{
                color: password.length < 6 ? 'red' : 'primary',
                fontSize: 12,
                marginTop: 5,
              }}
            >
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
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={[styles.input, { padding: 0 }]}>
            <Picker selectedValue={category} onValueChange={(value) => setCategory(value)}>
              <Picker.Item label="Restaurant" value="restaurant" />
              <Picker.Item label="Retail" value="retail" />
              <Picker.Item label="Services" value="services" />
              <Picker.Item label="Health & Beauty" value="health_beauty" />
              <Picker.Item label="Entertainment" value="entertainment" />
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
        <TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
          <Text style={styles.signInLink}>
            Already have an account? <Text style={styles.linkText}>Sign In</Text>
          </Text>
        </TouchableOpacity>

        <Toast />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles as needed
  signInLink: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#555',
  },
  linkText: {
    color: '#3b82f6',
    fontFamily: 'outfit-medium',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  inner: {
    marginTop: 20,
    paddingBottom: 50,
    paddingTop: 60,
  },
  title: {
    marginTop: 20,
    fontFamily: 'outfit-medium',
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginBottom: 8,
    color: Colors.gray[800],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[400],
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: 'outfit',
    fontSize: 16,
    paddingVertical: 12,
    color: Colors.gray[800],
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontFamily: 'outfit',
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 30,
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'outfit-medium',
    fontSize: 16,
    textAlign: 'center',
  },
});
