import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import styles from '../../src/styles/create-trip/whosTravelingStyles';

const travelOptions = [
  {
    key: 'solo',
    title: 'Just Me',
    description: 'A sole traveler in exploration',
    icon: <MaterialIcons name="person-outline" size={32} color="#3b82f6" />,
    color: '#3b82f6',
  },
  {
    key: 'couple',
    title: 'A Couple',
    description: 'Two travelers in tandem',
    icon: <FontAwesome name="heart" size={32} color="#ef4444" />,
    color: '#ef4444',
  },
  {
    key: 'family',
    title: 'Family',
    description: 'A group of fun loving adventurers',
    icon: <FontAwesome5 name="users" size={32} color="#10b981" />,
    color: '#10b981',
  },
  {
    key: 'friends',
    title: 'Friends',
    description: 'A bunch of thrill-seekers',
    icon: <Ionicons name="boat-outline" size={32} color="#f59e0b" />,
    color: '#f59e0b',
  },
];

export default function WhosTravelingScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();
  const { tripId } = useLocalSearchParams(); // ✅ receiving tripId
  const hasSaved = useRef(false);

  useEffect(() => {
    const saveTrip = async () => {
      if (!selected || hasSaved.current) return;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !tripId) {
          Alert.alert('Error', 'User not logged in or trip ID missing');
          return;
        }

        const tripDocRef = doc(db, 'Travler', user.uid, 'trip', String(tripId));

        await updateDoc(tripDocRef, {
          travelType: selected,
        });

        hasSaved.current = true;

        // Go to next screen, passing same tripId
        router.replace({
          pathname: '/Trip/select-dates',
          params: { tripId },
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to save trip type');
        console.error('Firestore error:', error);
      }
    };

    saveTrip();
  }, [selected]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
      </TouchableOpacity>

      <Text style={styles.title}>Who's Traveling</Text>
      <Text style={styles.subtitle}>Choose your travelers</Text>

      <ScrollView contentContainerStyle={styles.optionsContainer}>
        {travelOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            onPress={() => setSelected(option.key)}
            style={[
              styles.card,
              selected === option.key && styles.selectedCard,
              selected === option.key && { borderColor: option.color },
            ]}
          >
            <View style={styles.cardContent}>
              <View>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardDesc}>{option.description}</Text>
              </View>
              {option.icon}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
