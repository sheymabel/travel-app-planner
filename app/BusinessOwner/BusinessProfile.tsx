// app/auth/BusinessOwner/BusinessProfile.tsx
import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert, Platform, RefreshControl, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../configs/FirebaseConfig'; // Import the db instance
import { collection, doc, getDoc, updateDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

// Data structure for profile (similar to registration, but might evolve)
interface BusinessProfileData {
  id?: string; // Document ID from Firestore
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  categories: string[];
  createdAt?: Timestamp; // Keep track of creation time
  updatedAt?: Timestamp; // Track updates
}

// Category structure
interface Category {
  id: string;
  name: string;
}

// Placeholder: Assume we know the business ID (e.g., from auth state or previous navigation)
// In a real app, you'd get this dynamically.
const MOCK_BUSINESS_ID = "YOUR_BUSINESS_DOCUMENT_ID"; // <-- REPLACE THIS

export default function BusinessProfileScreen() {
  const [profile, setProfile] = useState<BusinessProfileData | null>(null);
  const [initialProfile, setInitialProfile] = useState<BusinessProfileData | null>(null); // To check for changes
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false); // For pull-to-refresh

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesCol = collection(db, 'categories');
      const q = query(categoriesCol, orderBy('name'));
      const categorySnapshot = await getDocs(q);
      const categoriesList = categorySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name as string,
      }));
      setAvailableCategories(categoriesList);
    } catch (err) {
      console.error("Error fetching categories: ", err);
      // Don't overwrite main error if profile fetch also failed
      if (!error) setError("Failed to load categories.");
    }
  }, [error]); // Depend on error state to avoid overwriting

  // Fetch Business Profile
  const fetchBusinessProfile = useCallback(async () => {
    if (!MOCK_BUSINESS_ID || MOCK_BUSINESS_ID === "YOUR_BUSINESS_DOCUMENT_ID") {
        setError("Business ID not configured. Cannot load profile.");
        setLoading(false);
        setRefreshing(false);
        return;
    }
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const businessDocRef = doc(db, 'businesses', MOCK_BUSINESS_ID);
      const docSnap = await getDoc(businessDocRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as BusinessProfileData;
        setProfile(data);
        setInitialProfile(data); // Store initial state
      } else {
        setError("Business profile not found.");
        setProfile(null);
        setInitialProfile(null);
      }
    } catch (err) {
      console.error("Error fetching business profile: ", err);
      setError("Failed to load profile. Please check your connection.");
      setProfile(null);
      setInitialProfile(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []); // No dependencies needed here for the core fetch logic

  // Initial data load
  useEffect(() => {
    fetchBusinessProfile();
    fetchCategories();
  }, [fetchBusinessProfile, fetchCategories]); // Run on mount

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Re-fetch both profile and categories
    Promise.all([fetchBusinessProfile(), fetchCategories()]).finally(() => {
        setRefreshing(false);
    });
  }, [fetchBusinessProfile, fetchCategories]);


  const handleInputChange = (field: keyof Omit<BusinessProfileData, 'categories' | 'id' | 'createdAt' | 'updatedAt'>, value: string) => {
    setProfile(prev => (prev ? { ...prev, [field]: value } : null));
     if (error && error !== "Please select at least one category.") {
        setError(null);
    }
  };

  const handleCategoryToggle = (categoryName: string) => {
    setProfile(prevProfile => {
      if (!prevProfile) return null;
      const currentCategories = prevProfile.categories || [];
      const updatedCategories = currentCategories.includes(categoryName)
        ? currentCategories.filter(c => c !== categoryName)
        : [...currentCategories, categoryName];
      return { ...prevProfile, categories: updatedCategories };
    });
     if (error === "Please select at least one category.") {
        setError(null);
    }
  };

   const validateForm = (): boolean => {
      if (!profile) return false;
      const { name, address, phone, email, description, categories } = profile;

      if (!name?.trim() || !address?.trim() || !phone?.trim() || !email?.trim() || !description?.trim()) {
          setError("All fields are required.");
          return false;
      }
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          setError("Please enter a valid email address.");
          return false;
      }
       const phoneRegex = /^[0-9\s\-()+.]{7,}$/;
       if (!phoneRegex.test(phone)) {
          setError("Please enter a valid phone number.");
          return false;
      }
      if (!categories || categories.length === 0) {
          setError("Please select at least one category.");
          return false;
      }
      setError(null);
      return true;
  }

  // Check if form data has changed
  const hasChanges = () => {
      if (!profile || !initialProfile) return false;
      return JSON.stringify(profile) !== JSON.stringify(initialProfile);
  };

  const handleSave = async () => {
    if (!profile || !profile.id || !validateForm() || !hasChanges()) {
        if (profile && initialProfile && !hasChanges()) {
             Alert.alert("No Changes", "You haven't made any changes to save.");
        }
        return;
    }

    setSaving(true);
    setError(null);

    try {
      const businessDocRef = doc(db, 'businesses', profile.id);
      const dataToUpdate: Partial<BusinessProfileData> = {
          ...profile,
          updatedAt: Timestamp.now(), // Add/update the timestamp
      };
      // Remove id from the data being sent to Firestore
      delete dataToUpdate.id;
      delete dataToUpdate.createdAt; // Don't overwrite creation time

      await updateDoc(businessDocRef, dataToUpdate);

      // Update initial state after successful save
      setInitialProfile(profile);

      Alert.alert("Success", "Profile updated successfully.");

    } catch (err) {
      console.error("Error updating profile: ", err);
      setError("Failed to update profile. Please try again.");
      Alert.alert("Error", "Could not save changes. Please check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  // --- Render Logic ---
  if (loading && !refreshing) { // Show full screen loader only on initial load
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile && !loading) { // Show error only if profile couldn't be loaded at all
    return (
      <SafeAreaView style={styles.safeArea}>
         <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4f46e5"]} tintColor={"#4f46e5"}/>}
         >
            <Text style={styles.title}>Business Profile</Text>
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={50} color="#dc2626" />
                <Text style={styles.errorTextLarge}>{error}</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
    );
  }

   if (!profile && !loading) { // Handle case where profile is null but no specific error (e.g., not found)
      return (
          <SafeAreaView style={styles.safeArea}>
              <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4f46e5"]} tintColor={"#4f46e5"}/>}
              >
                <Text style={styles.title}>Business Profile</Text>
                <View style={styles.errorContainer}>
                    <Ionicons name="information-circle-outline" size={50} color="#64748b" />
                    <Text style={styles.errorTextLarge}>Business profile data is unavailable.</Text>
                     <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Refresh</Text>
                    </TouchableOpacity>
                </View>
              </ScrollView>
          </SafeAreaView>
      );
  }

  // --- Main Form Render ---
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
       <KeyboardAvoidingView
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         style={{ flex: 1 }}
         keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
       >
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#4f46e5"]} // Spinner color for Android
                    tintColor={"#4f46e5"} // Spinner color for iOS
                />
            }
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Update Business Profile</Text>

            {/* Display non-blocking errors (like category fetch failure) */}
            {error && <Text style={[styles.errorTextSmall, { marginBottom: 15 }]}>{error}</Text>}

            {/* --- Form Fields --- */}
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Name</Text>
            <TextInput
                style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                value={profile?.name || ''}
                onChangeText={(text) => handleInputChange('name', text)}
                placeholder="Enter business name"
                placeholderTextColor="#9ca3af"
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
            />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={[styles.input, styles.textArea, focusedField === 'address' && styles.inputFocused]}
                value={profile?.address || ''}
                onChangeText={(text) => handleInputChange('address', text)}
                placeholder="Enter business address"
                placeholderTextColor="#9ca3af"
                multiline
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField(null)}
            />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
                style={[styles.input, focusedField === 'phone' && styles.inputFocused]}
                value={profile?.phone || ''}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="Enter phone number"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
            />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Contact Email</Text>
            <TextInput
                style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                value={profile?.email || ''}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="Enter contact email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="emailAddress"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
            />
            </View>

            <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea, focusedField === 'description' && styles.inputFocused]}
                value={profile?.description || ''}
                onChangeText={(text) => handleInputChange('description', text)}
                placeholder="Describe your business"
                placeholderTextColor="#9ca3af"
                multiline
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField(null)}
            />
            </View>

            {/* --- Category Selector --- */}
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Business Categories</Text>
            <Text style={styles.labelHint}>Select all relevant categories</Text>
            {availableCategories.length === 0 && !error ? (
                 <Text style={styles.infoText}>No categories available.</Text>
            ) : (
                <View style={styles.categoryContainer}>
                    {availableCategories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                        styles.categoryChip,
                        profile?.categories?.includes(category.name) && styles.categoryChipSelected,
                        ]}
                        onPress={() => handleCategoryToggle(category.name)}
                        activeOpacity={0.7}
                    >
 {profile?.categories?.includes(category.name) && ( // Check if category is selected
                           <Ionicons name="checkmark-circle" size={16} color="#3730a3" style={styles.chipIcon} />
                         )}
                        <Text
                        style={[
                            styles.categoryChipText,
                            profile?.categories?.includes(category.name) && styles.categoryChipTextSelected,
                        ]}
                        >
                        {category.name}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
            )}
            </View>
            {/* --- End Category Selector --- */}

            <TouchableOpacity
                style={[styles.saveButton, (saving || !hasChanges()) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving || !hasChanges()} // Disable if saving or no changes made
                activeOpacity={0.8}
            >
            {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
            ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// --- Styles (Similar to Register, but adjusted slightly for Profile context) ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // Consistent light background
  },
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#64748b',
  },
   errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300, // Ensure container takes some space
  },
  errorTextLarge: {
    fontSize: 16,
    color: '#dc2626', // Error red
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    fontWeight: '500',
  },
  retryButton: {
      backgroundColor: '#4f46e5', // Indigo
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      shadowColor: '#4f46e5',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2,
  },
  retryButtonText: {
      color: '#ffffff',
      fontSize: 15,
      fontWeight: 'bold',
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b', // Dark Slate
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600', // Semibold
    color: '#334155', // Medium Slate
    marginBottom: 8,
  },
  labelHint: {
      fontSize: 13,
      color: '#64748b', // Soft Slate
      marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1', // Light Gray border
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b', // Dark input text
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
      borderColor: '#4f46e5', // Indigo border on focus
      borderWidth: 1.5,
      shadowColor: '#4f46e5',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
  },
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  // Category Styles
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0', // Light Gray background
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20, // Rounded pill shape
    borderWidth: 1,
    borderColor: '#cbd5e1', // Match input border
  },
  categoryChipSelected: {
    backgroundColor: '#e0e7ff', // Light Indigo background
    borderColor: '#a5b4fc', // Softer Indigo border
  },
   chipIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569', // Medium Gray text
  },
  categoryChipTextSelected: {
    color: '#3730a3', // Darker Indigo text
    fontWeight: '600', // Bolder when selected
  },
  // End Category Styles
  saveButton: {
    backgroundColor: '#4f46e5', // Primary Indigo
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#a5b4fc', // Lighter indigo when disabled
    shadowOpacity: 0.1,
    elevation: 1,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorTextSmall: { // For non-blocking errors shown above form
    color: '#dc2626', // Error Red
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 15,
    fontWeight: '500',
  },
   infoText: {
      color: '#64748b', // Soft Slate
      textAlign: 'center',
      fontSize: 14,
      marginTop: 10,
  }
});
