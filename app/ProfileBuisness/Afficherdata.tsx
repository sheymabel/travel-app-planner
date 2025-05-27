import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../src/styles/business-owner/editProfilScreenStyles';

interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  fullName: string;
  website: string;
  profileImage?: string;
  profileImages?: string[];
  updatedAt?: string;
}

export default function AfficherBusinessProfile () {
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/business-owner/BusinessProfile');
          return;
        }

        const docRef = doc(db, 'business', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBusinessData(docSnap.data() as BusinessData);
        } else {
          Alert.alert('Error', 'businessdata not found');
        }
      } catch (error) {
        console.error('Error fetching businessdata:', error);
        Alert.alert('Error', 'Failed to fetch businessProfile');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError) {
      return require('../../assets/images/tunis.png');
    }
    if (businessData?.profileImages?.length) {
      return { uri: businessData.profileImages[0] };
    }
    if (businessData?.profileImage) {
      return { uri: businessData.profileImage };
    }
    return require('../../assets/images/tunis.png');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#82B6F1FF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!businessData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>No businessdata available</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/business-owner/BusinessProfile')} >
          <Ionicons name="arrow-back" size={24} color="#2A2D31FF" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.replace('/ProfileBuisness/EditProfilebuss')}
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

      {/* Owner Information Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>Owner Information</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.fullName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.phone}</Text>
        </View>
      </View>

      {/* businessInformation Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>businessInformation</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.name}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="pricetags-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.category}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="globe-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.website || 'Not specified'}</Text>
        </View>
      </View>

      {/* Description Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.descriptionText}>
          {businessData.description || 'No description provided'}
        </Text>
      </View>
    </ScrollView>
  );
};
