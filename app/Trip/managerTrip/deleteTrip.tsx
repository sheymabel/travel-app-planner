import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getFirestore, doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import app from '../../../configs/FirebaseConfig';
import { Colors } from '../../../constants/Colors';

interface Trip {
  id: string;
  city?: string;
  governorate?: string;
  delegation?: string;
  travelType?: string;
  selectedDates?: string[];
}

const db = getFirestore(app);
const auth = getAuth(app);

export default function DeleteTrip() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          router.push('/sign-in');
          return;
        }
        const tripCollectionRef = collection(db, 'Travler', user.uid, 'trip');
        const querySnapshot = await getDocs(tripCollectionRef);
        const tripsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Trip));
        setTrips(tripsData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load trips');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDeleteTrip = async (trip: Trip) => {
    setDeletingId(trip.id);
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${trip.city ? `the trip to ${trip.city}` : 'this trip'}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setDeletingId(null)
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => confirmDelete(trip.id)
        },
      ]
    );
  };

  const confirmDelete = async (tripId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, 'Travler', user.uid, 'trip', tripId));
      setTrips(prev => prev.filter(t => t.id !== tripId));
      Alert.alert('Success', 'Trip deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete trip');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDateRange = (dates: string[] = []) => {
    if (dates.length === 0) return 'No dates set';
    
    try {
      const dateObjects = dates
        .map(dateStr => new Date(dateStr))
        .filter(date => !isNaN(date.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      if (dateObjects.length === 0) return 'Invalid dates';
      if (dateObjects.length === 1) return dateObjects[0].toLocaleDateString();

      return `${dateObjects[0].toLocaleDateString()} - ${dateObjects[dateObjects.length - 1].toLocaleDateString()}`;
    } catch {
      return 'Invalid dates';
    }
  };

  const getTripTitle = (trip: Trip) => {
    return [
      trip.city,
      trip.governorate,
      trip.delegation
    ].filter(Boolean).join(', ') || 'Unnamed Trip';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Delete Your Trips</Text>
      
      {trips.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="luggage" size={48} color={Colors.gray[400]} />
          <Text style={styles.emptyText}>No trips found</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/Trip/managerTrip/ModifyTrip')}
          >
            <Text style={styles.createButtonText}>Create New Trip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tripList}>
          {trips.map(trip => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{getTripTitle(trip)}</Text>
                <Text style={styles.tripDates}>{formatDateRange(trip.selectedDates)}</Text>
                {trip.travelType && (
                  <Text style={styles.tripType}>{trip.travelType}</Text>
                )}
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTrip(trip)}
                disabled={deletingId === trip.id}
              >
                {deletingId === trip.id ? (
                  <ActivityIndicator size="small"/>
                ) : (
                  <MaterialIcons name="delete"  />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/Trip/managerTrip/mangerTrip')}
      >
        <Text style={styles.backButtonText}>Back to Trip Manager</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: Colors.gray[50],
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[50],
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray[600],
    fontFamily: 'outfit-medium',
  },
  title: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: Colors.gray[500],
    fontFamily: 'outfit-medium',
    marginVertical: 16,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
  tripList: {
    width: '100%',
    marginBottom: 20,
  },
  tripCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.gray[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: Colors.gray[800],
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.gray[600],
    marginBottom: 4,
  },
  tripType: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.gray[500],
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  backButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.gray[200],
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.gray[800],
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
});