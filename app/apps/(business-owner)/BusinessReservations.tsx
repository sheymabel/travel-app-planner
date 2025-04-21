// app/auth/BusinessOwner/BusinessReservations.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

// Mock data structure
type ReservationStatus = 'pending' | 'confirmed' | 'rejected';

interface Reservation {
  id: string;
  customerName: string;
  serviceName: string;
  date: string; // Use string for simplicity, consider Date object
  status: ReservationStatus;
}

const fetchReservations = async (): Promise<Reservation[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 'r1', customerName: 'Alice Smith', serviceName: 'Guided City Tour', date: '2024-08-15', status: 'pending' },
    { id: 'r2', customerName: 'Bob Johnson', serviceName: 'Mountain Hiking Adventure', date: '2024-08-16', status: 'confirmed' },
    { id: 'r3', customerName: 'Charlie Brown', serviceName: 'Coastal Kayaking', date: '2024-08-17', status: 'pending' },
    { id: 'r4', customerName: 'Diana Prince', serviceName: 'Guided City Tour', date: '2024-08-18', status: 'rejected' },
  ];
};

const updateReservationStatusAPI = async (id: string, status: ReservationStatus): Promise<boolean> => {
  // Simulate API call
  console.log(`Updating reservation ${id} to status: ${status}`);
  await new Promise(resolve => setTimeout(resolve, 500));
  return Math.random() > 0.1; // 90% success rate
}

export default function BusinessReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReservationStatus | 'all'>('all');
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  const loadReservations = () => {
    setLoading(true);
    fetchReservations()
      .then(data => {
        setReservations(data);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch reservations:", err);
        setError("Could not load reservations.");
        setReservations([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReservations();
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: ReservationStatus) => {
    const success = await updateReservationStatusAPI(id, newStatus);
    if (success) {
      setReservations(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
      );
      Alert.alert("Success", `Reservation status updated to ${newStatus}.`);
    } else {
      Alert.alert("Error", "Failed to update reservation status.");
    }
  };

  const getStatusStyle = (status: ReservationStatus) => {
    switch (status) {
      case 'confirmed': return styles.statusConfirmed;
      case 'pending': return styles.statusPending;
      case 'rejected': return styles.statusRejected;
      default: return {};
    }
  };

  const filteredReservations = reservations.filter(r => filter === 'all' || r.status === filter);

  const renderFilterButton = (status: ReservationStatus | 'all') => (
    <TouchableOpacity
      key={status}
      style={[styles.filterButton, filter === status && styles.filterButtonActive]}
      onPress={() => setFilter(status)}
    >
      <Text style={[styles.filterButtonText, filter === status && styles.filterButtonTextActive]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderReservationItem = ({ item, index }: { item: Reservation; index: number }) => (
    <Animated.View
      style={[
        styles.itemContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: fadeAnim },
          ],
        },
      ]}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.dateText}>Date: {item.date}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      {item.status === 'pending' && (
        <View style={styles.itemActions}>
          <TouchableOpacity 
            onPress={() => handleUpdateStatus(item.id, 'confirmed')} 
            style={[styles.actionButton, styles.confirmButton]}
          >
            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.success} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleUpdateStatus(item.id, 'rejected')} 
            style={[styles.actionButton, styles.rejectButton]}
          >
            <Ionicons name="close-circle-outline" size={24} color={Colors.error} />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <Animated.View
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {(['all', 'pending', 'confirmed', 'rejected'] as const).map(renderFilterButton)}
      </Animated.View>

      {loading && !reservations.length ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />
      ) : error ? (
        <Animated.View
          style={[
            styles.errorContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredReservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Animated.View
              style={[
                styles.emptyContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <Text style={styles.emptyText}>No reservations found matching the filter.</Text>
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: Colors.white,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: Colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray[700],
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  listContainer: {
    padding: 15,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: Colors.errorLight,
    margin: 20,
    borderRadius: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.gray[600],
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
  },
  serviceName: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 3,
  },
  dateText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 3,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  statusPending: { backgroundColor: Colors.warning },
  statusConfirmed: { backgroundColor: Colors.success },
  statusRejected: { backgroundColor: Colors.error },
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
  },
  confirmButton: {
    marginRight: 5,
  },
  rejectButton: {
    // No extra margin needed on the right
  },
});
