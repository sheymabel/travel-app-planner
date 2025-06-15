import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAuth, signOut } from 'firebase/auth'; // Added signOut import
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Ionicons, AntDesign } from '@expo/vector-icons'; // Ensure AntDesign is imported
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert(t('success'), t('logoutSuccess')); // Optional success message
      router.replace('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(t('error'), t('logoutError'));
    }
  };

  const getImageSource = () => {
    if (imageError || !businessData?.profileImage) {
      return require('../../assets/images/icon.png');
    }
    return { uri: businessData.profileImage };
  };

  const appItems = [
    {
      icon: <AntDesign name="logout" size={24} color="#EF4444" />,
      label: t('logOut'),
      action: handleLogout,
    },
  ];

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
   <SafeAreaView style={styles.safeArea} edges={['top']} >
         <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
           <View style={styles.inner}>
                   <View style={styles.header}>
                     <Text style={styles.title} accessible={false}>Profile</Text>
                   </View>
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
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.category}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.city}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="globe-outline" size={18} color="#666" />
          <Text style={styles.infoText}>{businessData.website}</Text>
        </View>
      </View>
 <TouchableOpacity
              onPress={() => router.push('/ProfileBuisness/EditProfilebuss')}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>{t('Edit Profile')}</Text>
            </TouchableOpacity>
      {/* Description Card */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t('About Us')}</Text>
        <Text style={styles.descriptionText}>{businessData.description}</Text>
      </View>

      {/* App Items (Logout) */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>{t('Settings')}</Text>
        {appItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            //style={styles.appItem}
            onPress={item.action}
            accessibilityLabel={item.label}>
            <View >{item.icon}</View>
            <Text >{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}