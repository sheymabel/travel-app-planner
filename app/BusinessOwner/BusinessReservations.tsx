// app/auth/BusinessOwner/BusinessReservations.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

  const renderReservationItem = ({ item }: { item: Reservation }) => (
    <View style={styles.itemContainer}>
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
          <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'confirmed')} style={[styles.actionButton, styles.confirmButton]}>
             <Ionicons name="checkmark-circle-outline" size={24} color="#16a34a" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleUpdateStatus(item.id, 'rejected')} style={[styles.actionButton, styles.rejectButton]}>
             <Ionicons name="close-circle-outline" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
       <View style={styles.filterContainer}>
         {/* Basic Filter Buttons */}
         {(['all', 'pending', 'confirmed', 'rejected'] as const).map(statusFilter => (
            <TouchableOpacity
              key={statusFilter}
              style={[styles.filterButton, filter === statusFilter && styles.filterButtonActive]}
              onPress={() => setFilter(statusFilter)}
            >
              <Text style={[styles.filterButtonText, filter === statusFilter && styles.filterButtonTextActive]}>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </Text>
            </TouchableOpacity>
         ))}
       </View>

      {loading && !reservations.length ? (
        <ActivityIndicator size="large" color="#4f46e5" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredReservations}
          renderItem={renderReservationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No reservations found matching the filter.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filterContainer: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     paddingVertical: 10,
     paddingHorizontal: 10,
     borderBottomWidth: 1,
     borderBottomColor: '#e5e7eb',
  },
  filterButton: {
     paddingVertical: 8,
     paddingHorizontal: 12,
     borderRadius: 15,
     backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
     backgroundColor: '#4f46e5',
  },
  filterButtonText: {
     fontSize: 13,
     fontWeight: '500',
     color: '#374151',
  },
  filterButtonTextActive: {
     color: '#fff',
  },
  listContainer: {
    padding: 15,
  },
  loadingIndicator: {
    marginTop: 50,
  },
  itemContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemInfo: {
    flex: 1,
    marginRight: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  serviceName: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 3,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 3,
    marginBottom: 8,
  },
  statusBadge: {
     paddingHorizontal: 8,
     paddingVertical: 3,
     borderRadius: 10,
     alignSelf: 'flex-start', // Keep badge size contained
  },
  statusText: {
     fontSize: 12,
     fontWeight: 'bold',
     color: '#fff', // White text for all badges
     textTransform: 'uppercase',
  },
  statusPending: { backgroundColor: '#f59e0b' }, // Amber
  statusConfirmed: { backgroundColor: '#16a34a' }, // Green
  statusRejected: { backgroundColor: '#dc2626' }, // Red
  itemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
  },
  confirmButton: {
    marginRight: 5, // Space between buttons
  },
  rejectButton: {
    // No extra margin needed on the right
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#6b7280',
  },
});
