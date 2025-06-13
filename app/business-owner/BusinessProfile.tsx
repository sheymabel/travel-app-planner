import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import styles from '../../src/styles/business-owner/editProfilScreenStyles';

interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  category: string;
  city: string;
  website: string;
  profileImage?: string; // Base64 string
}

export default function BusinessProfile() {
  const { t } = useTranslation();
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
          Alert.alert(t('error'), t('business.notAuthenticated'));
          router.replace('/sign-in');
          return;
        }

        const docRef = doc(db, 'business', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setBusinessData({
            name: data.name || t('business.noData'),
            email: data.email || t('business.noData'),
            phone: data.phone || t('business.noData'),
            address: data.address || t('business.noData'),
            description: data.description || t('business.noData'),
            category: data.category || t('business.noData'),
            city: data.city || t('business.noData'),
            website: data.website || t('business.noData'),
            profileImage: data.profileImage || '',
          });
        } else {
          Alert.alert(t('error'), t('business.profileNotFound'));
          router.replace('/ProfileBuisness/EditProfilebuss');
          setBusinessData(null);
        }
      } catch (error) {
        console.error('Error fetching business data:', error);
        Alert.alert(t('error'), t('business.loadFailed'));
        setBusinessData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, [t, router, auth]);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSource = () => {
    if (imageError || !businessData?.profileImage) {
      return require('../../assets/images/tunis.png');
    }
    return { uri: businessData.profileImage };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#82B6F1FF" />
        <Text style={styles.loadingText}>{t('business.loadingProfile')}</Text>
      </View>
    );
  }

  if (!businessData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>{t('business.noBusinessData')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/ProfileBuisness/EditProfilebuss')}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>{t('Edit')}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.profileImage}
          onError={handleImageError}
          resizeMode="cover"
          accessibilityLabel={t('profileImage')}
        />
      </View>

      {/* Owner Information Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t('Information')}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.name}</Text>
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

     
      {/* Description Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t('business.aboutUs')}</Text>
        <Text style={styles.descriptionText}>{businessData.description}</Text>
      </View>
    </ScrollView>
  );
}