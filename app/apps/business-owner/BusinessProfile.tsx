import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth'; // Firebase Authentication import

const ProfileScreen = () => {
  const router = useRouter();
  const auth = getAuth();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Redirect to the login screen after successful logout
        router.replace('./auth/sign-in');
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  // Menu items
  const menuItems = [
    { icon: <Ionicons name="heart-outline" size={24} color="#1F2937" />, label: 'Favourites' },
    { icon: <Ionicons name="download-outline" size={24} color="#1F2937" />, label: 'Downloads' },
  ];

  // Settings items
  const settingsItems = [
    { icon: <MaterialIcons name="language" size={24} color="#1F2937" />, label: 'Languages' },
    { icon: <Ionicons name="location-outline" size={24} color="#1F2937" />, label: 'Location' },
    { icon: <MaterialCommunityIcons name="credit-card-outline" size={24} color="#1F2937" />, label: 'Subscription' },
    { icon: <Ionicons name="eye-outline" size={24} color="#1F2937" />, label: 'Display' },
  ];

  // App-related items
  const appItems = [
    { icon: <MaterialCommunityIcons name="cached" size={24} color="#1F2937" />, label: 'Clear Cache' },
    { icon: <MaterialCommunityIcons name="history" size={24} color="#1F2937" />, label: 'Clear History' },
    { icon: <AntDesign name="logout" size={24} color="#1F2937" />, label: 'Log Out', action: handleLogout },
  ];

  // Logout function
 
  // Render menu item
  const renderMenuItem = (item: { icon: JSX.Element; label: string, action?: () => void }, index: number) => (
    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemIcon}>
        {item.icon}
      </View>
      <Text style={styles.menuItemLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Feather name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>Sabrina Aryan</Text>
          <Text style={styles.profileEmail}>SabrinaAry208@gmail.com</Text>
          
          {/* Edit Profile Button */}
          <TouchableOpacity 
          onPress={() => router.replace('./EditProfilebuss')}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Section */}
        <View style={styles.menuGroup}>
          {menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.divider} />

        <View style={styles.menuGroup}>
          {settingsItems.map(renderMenuItem)}
        </View>

        <View style={styles.divider} />

        <View style={styles.menuGroup}>
          {appItems.map(renderMenuItem)}
        </View>

        <Text style={styles.appVersion}>App Version 2.3</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles for the ProfileScreen component
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  menuGroup: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItemIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuItemLabel: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
});

export default ProfileScreen;
