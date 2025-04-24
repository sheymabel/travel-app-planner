import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
const ProfileTraveler = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Sheyma</Text>
        <Text style={styles.email}>sheyma@example.com</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.action}>
          <Ionicons name="settings-outline" size={22} color="#444" />
          <Text style={styles.actionText}>Account Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <MaterialIcons name="bookmark-border" size={22} color="#444" />
          <Text style={styles.actionText}>My Bookmarks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.action}>
          <FontAwesome name="history" size={22} color="#444" />
          <Text style={styles.actionText}>Trip History</Text>
        </TouchableOpacity>

        <TouchableOpacity  onPress={() => router.push('/auth/sign-in')}
        style={styles.action}>
          <Ionicons name="log-out-outline" size={22} color="#e53935" />
          <Text style={[styles.actionText, { color: '#e53935' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileTraveler;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 999,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    marginTop: 20,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});
