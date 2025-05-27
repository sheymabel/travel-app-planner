import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, Modal, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons,  Feather, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useTranslation } from 'react-i18next';
import i18n from '../../src/utils/i18n';
import styles from '../../src/styles/business-owner/ProfileScreen.styles';

export default function  ProfileScreen  ()  {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = getAuth();
  
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    businessName: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchbusinessData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.replace('/sign-in');
          return;
        }

        const businessDocRef = doc(db, 'business', user.uid);
        const businessDoc = await getDoc(businessDocRef);

        if (businessDoc.exists()) {
          setUserData({
            fullName: user.displayName || t('defaultName'),
            email: user.email || t('defaultEmail'),
            businessName: businessDoc.data().businessName || t('defaultbusinessName')
          });
        } else {
          setUserData({
            fullName: user.displayName || t('defaultName'),
            email: user.email || t('defaultEmail'),
            businessName: t('defaultbusinessName')
          });
        }
      } catch (error) {
        Alert.alert(t('error'), t('dataLoadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchbusinessData();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => router.replace('/sign-in'))
      .catch((error) => Alert.alert(t('error'), error.message));
  };

  const handleLanguageSelect = (language: string) => {
    i18n.changeLanguage(language);
    setLanguageModalVisible(false);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderMenuItem = (
    item: { icon: JSX.Element; label: string; action?: () => void }, 
    index: number
  ) => (
    <TouchableOpacity key={index} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemIcon}>
        {item.icon}
      </View>
      <Text style={styles.menuItemLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  const menuItems = [
    { 
      icon: <Ionicons name="heart-outline" size={24} color="#1F2937" />, 
      label: t('favourites'),
      action: () => toggleSection('favorites')
    },
    { 
      icon: <Ionicons name="download-outline" size={24} color="#1F2937" />, 
      label: t('downloads'),
      action: () => toggleSection('downloads')
    },
  ];

  const settingsItems = [
    { 
      icon: <MaterialIcons name="language" size={24} color="#1F2937" />, 
      label: t('languages'),
      action: () => setLanguageModalVisible(true)
    },
    { 
      icon: <Ionicons name="location-outline" size={24} color="#1F2937" />, 
      label: t('location'),
      action: () => toggleSection('location')
    },
  ];

  const appItems = [
    { 
      icon: <AntDesign name="logout" size={24} color="#1F2937" />, 
      label: t('logOut'), 
      action: handleLogout 
    },
  ];

  const renderSectionContent = () => {    
    switch (activeSection) {
      case 'favorites':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{t('yourFavourites')}</Text>
            <Text>{t('noFavourites')}</Text>
          </View>
        );
      case 'downloads':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{t('yourDownloads')}</Text>
            <Text>{t('noDownloads')}</Text>
          </View>
        );
      case 'location':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>{t('locationSettings')}</Text>
            <Text>{t('currentLocation')}: {t('notSet')}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>{t('dataLoadError')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIconContainer}>
              <Feather name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.profileName}>{userData.businessName}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
          <Text style={styles.ownerName}>{userData.fullName}</Text>

          <TouchableOpacity
            onPress={() => router.replace('/ProfileBuisness/Afficherdata')}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>{t('editProfile')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuGroup}>{menuItems.map(renderMenuItem)}</View>
        {activeSection && renderSectionContent()}
        <View style={styles.divider} />

        <View style={styles.menuGroup}>{settingsItems.map(renderMenuItem)}</View>
        {activeSection && renderSectionContent()}
        <View style={styles.divider} />
        <View style={styles.menuGroup}>{appItems.map(renderMenuItem)}</View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>
              {['en', 'fr', 'ar'].map((lang) => (
                <Pressable
                  key={lang}
                  style={styles.modalOption}
                  onPress={() => handleLanguageSelect(lang)}
                >
                  <Text>{t(`languages.${lang}`)}</Text>
                  {i18n.language === lang && (
                    <Ionicons name="checkmark" size={20} color="green" />
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
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

 