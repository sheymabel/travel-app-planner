import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRouter } from 'expo-router';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';

interface Trip {
  id: string;
  city?: string;
  governorate?: string;
  delegation?: string;
  travelType?: string;
  selectedDates?: string[];
}

export default function TripScreen() {
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const router = useRouter();

  const db = getFirestore(app);
  const auth = getAuth(app);
  const navigation = useNavigation();
  useEffect(() => {
     navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uid = user.uid;
          const tripCollectionRef = collection(db, 'Travler', uid, 'trip');
          const querySnapshot = await getDocs(tripCollectionRef);
          const trips: Trip[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort trips in descending order (most recent first)
          const sortedTrips = trips.sort((a, b) => {
            const dateA = a.selectedDates?.[0] || '';
            const dateB = b.selectedDates?.[0] || '';
            return dateB.localeCompare(dateA); // descending
          });

          setUserTrips(sortedTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        }
      } else {
        console.warn('User is not authenticated.');
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  const formatDateRange = (dates?: string[]) => {
    if (!dates || dates.length === 0) return 'Dates not selected';
    if (dates.length === 1) return dates[0];
    return `${dates[0]} → ${dates[dates.length - 1]}`;
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => router.replace('/Trip/managerTrip/mangerTrip')}
    >
      <View style={styles.dataRow}>
        <Ionicons name="location" size={22} color={Colors.primary} />
        <Text style={styles.dataLabel}>City:</Text>
        <Text style={styles.dataValue}>{item.city || 'Unnamed Trip'}</Text>
      </View>

      <View style={styles.dataRow}>
        <Ionicons name="map" size={20} color={Colors.gray[500]} />
        <Text style={styles.dataLabel}>Region:</Text>
        <Text style={styles.dataValue}>
          {[item.governorate, item.delegation].filter(Boolean).join(', ') || 'Region not set'}
        </Text>
      </View>

      <View style={styles.dataRow}>
        <Ionicons name="calendar" size={20} color={Colors.gray[500]} />
        <Text style={styles.dataLabel}>Dates:</Text>
        <Text style={styles.dataValue}>{formatDateRange(item.selectedDates)}</Text>
      </View>

      {item.travelType && (
        <View style={styles.dataRow}>
          <Ionicons
            name={item.travelType === 'business' ? 'briefcase' : 'airplane'}
            size={20}
            color={Colors.gray[500]}
          />
          <Text style={styles.dataLabel}>Type:</Text>
          <Text style={styles.dataValue}>
            {item.travelType.charAt(0).toUpperCase() + item.travelType.slice(1)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text style={styles.title} accessible={false}>My Trips</Text>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {userTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              You haven't added any trips yet.
            </Text>
          </View>
        ) : (
          <FlatList
            data={userTrips}
            renderItem={renderTripCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: 26,
    color: Colors.gray[800],
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'outfit-regular',
    fontSize: 18,
    color: Colors.gray[400],
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  tripCard: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  dataLabel: {
    fontFamily: 'outfit-medium',
    fontSize: 14,
    color: Colors.gray[700],
    marginLeft: 8,
  },
  dataValue: {
    fontFamily: 'outfit-regular',
    fontSize: 14,
    color: Colors.gray[600],
    marginLeft: 4,
    flexShrink: 1,
  },
});