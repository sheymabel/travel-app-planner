import React, { useState } from 'react';
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
import { Colors } from './../../constants/Colors';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from './../../configs/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';


type CategoryType =
  | 'restaurant'
  | 'retail'
  | 'services'
  | 'health_beauty'
  | 'entertainment'
  | 'other';

export default function BusinessRegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('other');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  const isFormValid =
    fullName && email && phone && address && password && description && category;
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
    
        await addDoc(collection(db, 'businesses'), {
          uid,
          fullName,
          email,
          password,
          phone,
          address,
          description,
          category,
          role:'business',
          createdAt: Timestamp.now(),
        });
    
        showToast('Business registered successfully!');
    
        setLoading(false);
        router.replace('/auth/sign-in');
      } catch (err: any) {
        console.error('Firebase error:', err);
        setLoading(false);
        showToast('Registration failed. Please try again.', 'error');
      }
    };
    
    

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner}>
        <TouchableOpacity
          onPress={() => router.replace('/auth/sign-up')}
          style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Register Your Business</Text>
        <Text style={styles.subtitle}>Provide some details about your business</Text>

        {error !== '' && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={[styles.input, error.includes('name') && { borderColor: 'red' }]}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, error.includes('email') && { borderColor: 'red' }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={[styles.input, error.includes('phone') && { borderColor: 'red' }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
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

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

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


{/* 🔙 Link to Sign In */}
<TouchableOpacity onPress={() => router.replace('/auth/sign-in')}>
  <Text style={styles.signInLink}>
    Already have an account? <Text style={styles.linkText}>Sign In</Text>
  </Text>
</TouchableOpacity>
<Toast/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    fontFamily: 'outfit',
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.gray[400],
    padding: 15,
    borderRadius: 10,
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



