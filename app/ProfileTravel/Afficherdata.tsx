import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../src/styles/business-owner/editProfilScreenStyles';

import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import app from '../../configs/FirebaseConfig'; // 🔹 Ensure your Firebase app is initialized here

interface TravelerData {
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  profileImages?: string[];
  bio?: string;
  country?: string;
}

export default function AfficherTravelerProfile() {
  const [loading, setLoading] = useState(true);
  const [travelerData, setTravelerData] = useState<TravelerData | null>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTravelerData = async () => {
      try {
        const auth = getAuth(app);
        const db = getFirestore(app);
        const user = auth.currentUser;

        if (!user) {
          router.replace('/sign-in');
          return;
        }

        const docRef = doc(db, 'Travler', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTravelerData(docSnap.data() as TravelerData);
        } else {
          Alert.alert('Error', 'Traveler profile not found');
        }
      } catch (error) {
        console.error('Error fetching traveler data:', error);
        Alert.alert('Error', 'Unable to load traveler profile');
      } finally {
        setLoading(false);
      }
    };

    fetchTravelerData();
  }, []);

  const handleImageError = () => setImageError(true);

  const getImageSource = () => {
    if (
      imageError ||
      (!travelerData?.profileImages?.length && !travelerData?.profileImage)
    ) {
      return require('../../assets/images/tunis.png');
    }
    return { uri: travelerData?.profileImages?.[0] || travelerData?.profileImage };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!travelerData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>No traveler data available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/traveler/profile')}>
          <Ionicons name="arrow-back" size={24} color="#99B6E0FF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/ProfileTravel/EditProfileTravel')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.profileImage}
          onError={handleImageError}
          resizeMode="cover"
        />
      </View>

      {/* Traveler Information */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Personal Information</Text>

        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{travelerData.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{travelerData.email}</Text>
        </View>

        {travelerData.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{travelerData.phone}</Text>
          </View>
        )}

        {travelerData.country && (
          <View style={styles.infoRow}>
            <Ionicons name="flag-outline" size={18} color="#666" />
            <Text style={styles.infoText}>{travelerData.country}</Text>
          </View>
        )}
      </View>

      {/* Bio Section */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.descriptionText}>
          {travelerData.bio || 'No bio available'}
        </Text>
      </View>
    </ScrollView>
  );
}
