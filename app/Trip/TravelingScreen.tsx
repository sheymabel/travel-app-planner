import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { getAuth } from 'firebase/auth';
import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
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
  const hasSaved = useRef(false);

  useEffect(() => {
    const saveTrip = async () => {
      if (!selected || hasSaved.current) return;

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          Alert.alert('Error', 'You must be logged in to continue');
          return;
        }

        const tripsRef = collection(db, 'Travler', user.uid, 'trip');

        // Check if a trip already exists
        const q = query(tripsRef, where('userId', '==', user.uid));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          // Trip exists – update the first one found
          const existingTripDoc = snapshot.docs[0];
          await updateDoc(doc(tripsRef, existingTripDoc.id), {
            travelType: selected,
          });
        } else {
          // No trip exists – add a new one
          await addDoc(tripsRef, {
            userId: user.uid,
            travelType: selected,
            createdAt: serverTimestamp(),
          });
        }

        hasSaved.current = true;
        router.replace('/Trip/select-dates');
      } catch (error) {
        Alert.alert('Error', 'Failed to save trip information');
        console.error('Firestore error:', error);
      }
    };

    saveTrip();
  }, [selected]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace('/Trip/Serch-place')}
        style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
        <Text style={{ display: 'none' }}>Back Button</Text>
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
