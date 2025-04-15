import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import  { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './../../../configs/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    Toast.show({
      type,
      position: 'top',
      text1: message,
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.replace('/auth/sign-in')}
          style={{
            marginLeft: 5,
            padding: 8,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const OnCreateAccount = async () => {
    if (!email || !password || !fullName || !selectedRole) {
      showToast('Please enter all details', 'error');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Travler', user.uid), {
        uid: user.uid,
        fullName,
        email,
        role: selectedRole,
        createdAt: new Date(),
        updatedAt: new Date(), // optional
        phoneNumber: '',   
        password,    // default empty, update later
        address: '',           // default empty
        profileImage: '',      // default profile image or URL
        isActive: true,        // to manage user status
      });
      
      // Show success toast
      showToast('Account created successfully');
    } catch (error: any) {
      console.error('Signup error:', error);
      showToast(error.message, 'error');
    }
  };

  return (
    <View style={{ padding: 25, paddingTop: 50, backgroundColor: Colors.white, height: '100%' }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 25, marginTop: 30 }}>
        Create New Account
      </Text>

      {/* Full Name */}
      <View>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View>
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Role Selection */}
      <Text style={styles.roleLabel}>Select your role:</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          onPress={() => setSelectedRole('Traveler')}
          style={[
            styles.roleButton,
            {
              backgroundColor: selectedRole === 'Traveler' ? Colors.Primary : Colors.white,
            },
          ]}
        >
          <Text
            style={{
              color: selectedRole === 'Traveler' ? Colors.white : Colors.Primary,
              textAlign: 'center',
              fontFamily: 'outfit',
            }}
          >
            Traveler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {setSelectedRole('Business-Owner');
            router.replace('./../auth/BusinessRegister')
          }}

          style={[
            styles.roleButton,
            {
              backgroundColor: selectedRole === 'Business-Owner' ? Colors.Primary : Colors.white,
            },
          ]}
        >
          <Text
            style={{
              color: selectedRole === 'Business-Owner' ? Colors.white : Colors.Primary,
              textAlign: 'center',
              fontFamily: 'outfit',
            }}
          >
            Business Owner
          </Text>
        </TouchableOpacity>
      </View>

      {/* Create Account Button */}
      <TouchableOpacity onPress={OnCreateAccount} style={styles.createBtn}>
        <Text style={styles.createBtnText}>Create Account</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <TouchableOpacity onPress={() => router.replace('/auth/sign-in')} style={styles.signInBtn}>
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  backButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 28,
    color: Colors.light.text,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: 15,
    color: Colors.Gray,
    marginBottom: 25,
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
    fontSize: 15,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.Gray,
    backgroundColor: '#FAFAFA',
    color: Colors.light.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
  },
  picker: {
    height: 50,
    width: '100%',
    color: Colors.light.text,
  },
  pickerItem: {
    fontFamily: 'outfit',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: Colors.Primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 25,
    shadowColor: Colors.Primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.Gray,
  },
  submitButtonText: {
    fontFamily: 'outfit-medium',
    color: Colors.white,
    fontSize: 16,
  },
  signInLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signInLinkText: {
    fontFamily: 'outfit',
    fontSize: 15,
    color: Colors.Primary,
    textDecorationLine: 'underline',
  },
  errorText: {
    fontFamily: 'outfit',
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
});
