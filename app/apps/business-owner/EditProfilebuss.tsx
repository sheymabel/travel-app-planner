// EditProfileScreen.tsx

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  birth: string;
  gender: string;
  imageUri: string;
}

  const EditProfileScreen = () => {  

  const router = useRouter();

  const [profile, setProfile] = useState<Profile>({
    firstName: 'Sabrina',
    lastName: 'Aryan',
    username: '@Sabrina',
    email: 'SabrinaAry208@gmail.com',
    phoneCode: '+234',
    phoneNumber: '904 6470',
    birth: '',
    gender: '',
    imageUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
  });

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "We need permission to access your gallery");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setProfile(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    // Later, here you would call your API to update the user profile.
    console.log('Profile saved:', profile);
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back} style={{ padding: 8 }}>
          <Feather name="arrow-left" size={24} color="#0A3D62" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: profile.imageUri }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIconContainer} onPress={handlePickImage}>
              <MaterialIcons name="edit" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          {/** Input Fields */}
          <InputField label="First Name" value={profile.firstName} onChange={v => setProfile(p => ({ ...p, firstName: v }))} />
          <InputField label="Last Name" value={profile.lastName} onChange={v => setProfile(p => ({ ...p, lastName: v }))} />
          <InputField label="Username" value={profile.username} onChange={v => setProfile(p => ({ ...p, username: v }))} autoCapitalize="none" />
          <InputField label="Email" value={profile.email} onChange={v => setProfile(p => ({ ...p, email: v }))} keyboardType="email-address" autoCapitalize="none" />
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputContainer}>
              <TouchableOpacity style={styles.phoneCodeContainer}>
                <Text style={styles.phoneCodeText}>{profile.phoneCode}</Text>
                <MaterialIcons name="arrow-drop-down" size={20} color="#6B7280" />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.phoneNumberInput]}
                value={profile.phoneNumber}
                onChangeText={v => setProfile(p => ({ ...p, phoneNumber: v }))}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Birth and Gender - simplified touchables */}
          <TouchableField label="Birth Date" value={profile.birth || 'Select Date'} />
          <TouchableField label="Gender" value={profile.gender || 'Select Gender'} />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  [key: string]: any;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChange}
      placeholder={`Enter ${label.toLowerCase()}`}
      {...props}
    />
  </View>
);

const TouchableField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.pickerButton}>
      <Text style={styles.pickerText}>{value}</Text>
      <MaterialIcons name="arrow-drop-down" size={24} color="#6B7280" />
    </TouchableOpacity>
  </View>
);

// --- STYLES remain almost the same, so no need to modify your styles much ---

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 15 : 12,
    paddingBottom: 12,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0, left: 0, right: 0, zIndex: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A3D62' },
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: 80 },
  profileHeader: { alignItems: 'center', paddingVertical: 20, backgroundColor: '#F3F4F6', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 20 },
  profileImageContainer: { position: 'relative' },
  profileImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#FFFFFF' },
  editIconContainer: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0A3D62', borderRadius: 15, padding: 6, borderWidth: 2, borderColor: '#FFFFFF' },
  form: { paddingHorizontal: 20 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: '#0A3D62', marginBottom: 6, fontWeight: '500' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0A3D62', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, color: '#1F2937' },
  phoneInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0A3D62', borderRadius: 12 },
  phoneCodeContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, borderRightWidth: 1, borderRightColor: '#D1D5DB' },
  phoneCodeText: { fontSize: 16, color: '#1F2937', marginRight: 4 },
  phoneNumberInput: { flex: 1, borderWidth: 0, borderRadius: 0, borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  pickerButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#0A3D62', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  pickerText: { fontSize: 16, color: '#1F2937' },
  saveButton: { flexDirection: 'row', backgroundColor: '#0A3D62', paddingVertical: 16, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 24, marginBottom: 30 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});
