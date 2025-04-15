// app/auth/BusinessOwner/BusinessServices.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // If needed for navigation to add/edit service
import { getFirestore, doc, getDoc } from "firebase/firestore";

// Mock data structure
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // e.g., "2 hours", "Full Day"
}

// Mock API functions
const fetchServices = async (): Promise<Service[]> => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return [
    { id: '1', name: 'Guided City Tour', description: 'Explore the historic landmarks.', price: 50, duration: '3 hours' },
    { id: '2', name: 'Mountain Hiking Adventure', description: 'Challenging hike with scenic views.', price: 75, duration: '6 hours' },
    { id: '3', name: 'Local Cuisine Cooking Class', description: 'Learn to cook traditional dishes.', price: 60, duration: '4 hours' },
    { id: '4', name: 'Airport Transfer', description: 'Comfortable transfer to/from the airport.', price: 40, duration: 'N/A' },
  ];
};

const deleteServiceAPI = async (id: string): Promise<boolean> => {
  console.log(`Attempting to delete service with ID: ${id}`);
  await new Promise(resolve => setTimeout(resolve, 600));
  return Math.random() > 0.1; // 90% success rate
};

export default function BusinessServicesScreen() {
  const router = useRouter(); // If navigating to add/edit screens
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = () => {
    setLoading(true);
    setError(null);
    fetchServices()
      .then(data => {
        setServices(data);
      })
      .catch(err => {
        console.error("Failed to fetch services:", err);
        setError("Could not load services.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the service "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            const success = await deleteServiceAPI(id);
            if (success) {
              setServices(prev => prev.filter(service => service.id !== id));
              Alert.alert("Success", `Service "${name}" deleted.`);
            } else {
              Alert.alert("Error", "Failed to delete service. Please try again.");
            }
            setDeletingId(null);
          },
        },
      ]
    );
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <View style={styles.serviceItem}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
        <View style={styles.serviceDetails}>
          <Text style={styles.servicePrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.serviceDuration}>{item.duration}</Text>
        </View>
      </View>
      <View style={styles.serviceActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => {/* Navigate to Edit */ Alert.alert("Edit", `Edit ${item.name}`)}}>
          <FontAwesome5 name="edit" size={18} color="#4f46e5" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDelete(item.id, item.name)}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <FontAwesome5 name="trash-alt" size={18} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => {/* Navigate to Add Service */ Alert.alert("Add", "Navigate to Add Service Screen")}}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Service</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#111827" style={styles.loader} />}

      {error && !loading && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && services.length === 0 && (
        <Text style={styles.emptyText}>No services found. Add your first service!</Text>
      )}

      {!loading && !error && services.length > 0 && (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // Adjust as needed if using header component
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981', // Green
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#ef4444',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#6b7280',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  listContainer: {
    padding: 20,
  },
  serviceItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10b981',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#4b5563',
  },
  serviceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
