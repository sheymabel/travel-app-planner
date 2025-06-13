import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter,useNavigation} from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useTranslation } from 'react-i18next';
import i18n from '../../src/utils/i18n';
import styles from '../../src/styles/create-trip/profiletrav';
import { Colors } from '../../constants/Colors';

interface TravelerData {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  address?: string;
  phone?: string;
  profileImage?: string;
  favorites?: string[]; // Added favorites array
}

export default function TravelerProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const auth = getAuth();
  const [traveler, setTraveler] = useState<TravelerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
useEffect(() => {
     navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
     }, []);
  const fetchTraveler = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert(t('error'), t('noUser'));
        router.replace('/sign-in');
        return;
      }

      const travelerDocRef = doc(db, 'Travler', user.uid);
      const travelerDoc = await getDoc(travelerDocRef);

      if (travelerDoc.exists()) {
        const data = travelerDoc.data();
        setTraveler({
          id: travelerDoc.id,
          fullName: data.fullName || t('defaultName'),
          email: data.email || user.email || t('defaultEmail'),
          bio: data.bio,
          address: data.address,
          phone: data.phone,
          favorites: data.favorites || [], // Initialize favorites
          profileImage: data.profileImage
            ? data.profileImage.startsWith('data:image/')
              ? data.profileImage
              : `data:image/png;base64,${data.profileImage}`
            : undefined,
        });
      } else {
        Alert.alert(t('error'), t('noTraveler'));
        setTraveler(null);
      }
    } catch (error: any) {
      console.error('Error fetching traveler data:', error);
      Alert.alert(t('error'), t('dataLoadError'));
    } finally {
      setLoading(false);
    }
  }, [auth, router, t]);

  useEffect(() => {
    fetchTraveler();
  }, [fetchTraveler]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/sign-in');
    } catch (error: any) {
      Alert.alert(t('error'), t('logoutError'));
    }
  };

  const handleLanguageSelect = useCallback((language: string) => {
    i18n.changeLanguage(language);
    setLanguageModalVisible(false);
  }, []);

  

  const renderMenuItem = useCallback(
    (
      item: { icon: JSX.Element; label: string; action?: () => void },
      index: number
    ) => (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={item.action}
        accessibilityLabel={item.label}
      >
        <View style={styles.menuItemIcon}>{item.icon}</View>
        <Text style={styles.menuItemLabel}>{item.label}</Text>
        <Feather name="chevron-right" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    ),
    []
  );

  const settingsItems = [
    {
      icon: <MaterialIcons name="language" size={24} color="#1F2937" />,
      label: t('languages'),
      action: () => setLanguageModalVisible(true),
    },
    {
      icon: <Ionicons name="heart-outline" size={24} color="#1F2937" />,
      label: t('favourites'),
      
    },
  ];

  const appItems = [
    {
      icon: <AntDesign name="logout" size={24} color="#EF4444" />,
      label: t('logOut'),
      action: handleLogout,
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#3B82F6" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!traveler) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>{t('noTraveler')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
                <View style={styles.header}>
                  <Text style={styles.title} accessible={false}>Profile</Text>
                </View>
                </View>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {traveler.profileImage ? (
              <Image
                source={{ uri: traveler.profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View >
                <Ionicons name="person" size={50} color="#6B7280" />
              </View>
            )}
            <TouchableOpacity
              onPress={() => Alert.alert(t('info'), t('editImagePrompt'))}
            >
              <Feather name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{traveler.fullName}</Text>
          <Text style={styles.profileEmail}>{traveler.email}</Text>
        </View>
          <View >
            {traveler.bio && (
              <View style={styles.infoCard}>
                <Text style={styles.sectionTitle}>{t('about')}</Text>
                <Text style={styles.profileBio}>{traveler.bio}</Text>
              </View>
            )}
            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>{t('contactInfo')}</Text>
              {traveler.phone && (
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{traveler.phone}</Text>
                </View>
              )}
              {traveler.address && (
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color="#6B7280" />
                  <Text style={styles.infoText}>{traveler.address}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => router.push('/ProfileTravel/EditProfileTravel')}
              style={styles.editButton}
            >
              <Text style={styles.editButtonText}>{t('editProfile')}</Text>
            </TouchableOpacity>
          </View>
          <View >
             <TouchableOpacity                         
              onPress={() => router.replace('/Trip/Favorites')}>
              <View style={styles.emptyState}>
              </View>
            </TouchableOpacity>
          </View>
  
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>{t('settings')}</Text>
          <View style={styles.menuGroup}>{settingsItems.map(renderMenuItem)}</View>
          <View style={styles.divider} />
          <View style={styles.menuGroup}>{appItems.map(renderMenuItem)}</View>
        </View>
        {/* Language Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
                {['en', 'fr'].map((lang) => (
                  <Pressable
                    key={lang}
                    style={styles.modalOption}
                    onPress={() => handleLanguageSelect(lang)}
                  >
                    <Text style={styles.modalOptionText}>{t(`languages.${lang}`)}</Text>
                    {i18n.language === lang && (
                      <Ionicons name="checkmark" size={20} color="#10B981" />
                    )}
                  </Pressable>
                ))}
                <Pressable
                  style={styles.modalClose}
                  onPress={() => setLanguageModalVisible(false)}
                >
                  <Text style={styles.modalCloseText}>{t('close')}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
