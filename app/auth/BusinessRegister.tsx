import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';
import { Colors } from '../../constants/Colors';
import { auth, db } from '../../configs/FirebaseConfig'; // Correct firebase imports

// Validation helpers
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPassword = (password: string) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password); // Minimum 6 chars, letters + numbers

export default function BusinessRegisterScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { label: 'Select a Category...', value: '' },
    { label: 'Restaurant', value: 'restaurant' },
    { label: 'Retail', value: 'retail' },
    { label: 'Services', value: 'services' },
    { label: 'Health & Beauty', value: 'health_beauty' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Other', value: 'other' },
  ];

  useEffect(() => {
    setSelectedCategory(categories[0].value);
    navigation.setOptions?.({ headerShown: false });
  }, []);

  const handleSignUp = async () => {
    if (!email || !password || !name || !address || !phone || !description || !selectedCategory) {
      Toast.show({ type: 'error', text1: 'Please fill out all fields' });
      return;
    }

    if (!isValidEmail(email)) {
      Toast.show({ type: 'error', text1: 'Invalid email address' });
      return;
    }

    if (!isValidPassword(password)) {
      Toast.show({
        type: 'error',
        text1: 'Weak password',
        text2: 'Must be 6+ characters and include numbers.',
      });
      return;
    }

    try {
      setSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Business Owner', user.uid), {
        name,
        email,
        phone,
        address,
        description,
        password,
         role: 'Business-Owner',
        category: selectedCategory,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: 'success',
        text1: 'Business Registered!',
        text2: 'Your business account has been created successfully.',
      });
      router.replace('../auth/sign-in');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Unexpected error');
      Toast.show({ type: 'error', text1: 'Signup failed', text2: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => router.replace('/auth/sign-up')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.title}>Register Your Business</Text>
        <Text style={styles.subtitle}>Provide your business details below.</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={Colors.Gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={Colors.Gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor={Colors.Gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={Colors.Gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your business address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={Colors.Gray}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Business Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCategory}
              onValueChange={(itemValue) => setSelectedCategory(itemValue)}
              style={styles.picker}
            >
              {categories.map((category) => (
                <Picker.Item
                  key={category.value}
                  label={category.label}
                  value={category.value}
                  style={styles.pickerItem}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about your business"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.Gray}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Register Business</Text>
          )}
        </TouchableOpacity>

        {/* Link to Sign In */}
        <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} style={styles.signInLink}>
          <Text style={styles.signInLinkText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </ScrollView>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 15,
    color: Colors.Gray,
    marginBottom: 25,
  },
  errorText: {
    color: 'red',
    fontFamily: 'outfit',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontFamily: 'outfit-medium',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
  },
  input: {
    fontFamily: 'outfit',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 10,
    backgroundColor: Colors.white,
    color: Colors.dark,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  picker: {
    height: 55,
    width: '100%',
    color: Colors.Gray,
  },
  pickerItem: {
    fontFamily: 'outfit',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.Primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: '60%',
    alignSelf: 'center',
    elevation: 2, // for subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.Gray,
  },
  submitButtonText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.white,
  },
  signInLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signInLinkText: {
    color: Colors.Primary,
    fontFamily: 'outfit-medium',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
