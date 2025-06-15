import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { auth, db } from '../../configs/FirebaseConfig';
import { styles } from '../../src/styles/business-owner/buisnesservice';
import { Colors } from '../../constants/Colors';

interface Service {
  id: string;
  name: string;
  date?: string;
  time?: string;
  provider?: string;
  rating?: string;
  reviews?: string;
  status?: string;
  imageUrl?: string; // Could be base64 or API URL
  price?: string;
  duration?: string;
}

export default function ServiceManagementScreen() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.warn('No user is currently logged in');
          return;
        }

        const servicesCollection = collection(db, 'business', user.uid, 'services');
        const snapshot = await getDocs(servicesCollection);
        const servicesData = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Service, 'id'>;
          console.log('Full Service data:', { id: doc.id, ...data }); // Detailed debug log
          return { id: doc.id, ...data };
        });
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch services.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, 'business', user.uid, 'services', selectedService.id));
      setServices((prev) => prev.filter((s) => s.id !== selectedService.id));
      setShowDeleteModal(false);
      Alert.alert('Success', 'Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      Alert.alert('Error', 'Failed to delete service');
    }
  };

  const isBase64 = (str: string) => {
    // Check if string is a valid base64 URI (starts with data:image/ and has base64 data)
    return str && str.startsWith('data:image/') && str.includes('base64,');
  };

  const isApiUrl = (str: string) => {
    // Simple check for common API URL patterns (e.g., http/https)
    return str && (str.startsWith('http://') || str.startsWith('https://'));
  };

  const ServiceCard = ({ service }: { service: Service }) => {
    // Test and set imageUri based on type
    let imageUri = 'https://placehold.co/150x150/png';
    if (service.imageUrl) {
      if (isBase64(service.imageUrl)) {
        imageUri = service.imageUrl;
        console.log('Detected as Base64 for', service.name, ':', service.imageUrl.substring(0, 50) + '...');
      } else if (isApiUrl(service.imageUrl)) {
        imageUri = service.imageUrl;
        console.log('Detected as API URL for', service.name, ':', service.imageUrl);
      } else {
        console.log('Invalid imageUrl for', service.name, ':', service.imageUrl, '- Using placeholder');
      }
    } else {
      console.log('No imageUrl for', service.name, '- Using placeholder');
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{service.status}</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/Service/EditServiceScreen?id=${service.id}`)}
            style={styles.editButton}
          >
            <Ionicons name="create-outline" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.serviceInfo}>
          <Image
            source={{ uri: imageUri }}
            style={imageStyles.serviceImage}
            resizeMode="cover"
            onError={(e) => console.log('Image load error for', service.name, ':', e.nativeEvent.error)}
          />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <View style={styles.priceDurationContainer}>
              <Text style={styles.priceText}>${service.price}</Text>
              <Text style={styles.durationText}>{service.duration}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setSelectedService(service);
            setShowDeleteModal(true);
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
          <Text style={styles.deleteButtonText}>Delete Service</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Service/add')}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>New Service</Text>
        </TouchableOpacity>
      </View>

      {services.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateText}>No services found</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/Service/add')}>
            <Text style={styles.addButtonText}>Create Your First Service</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>
            <Text style={styles.modalTitle}>Delete Service</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete "{selectedService?.name}" permanently? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmDeleteButton]} onPress={handleDeleteService}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const imageStyles = StyleSheet.create({
  gridContainer: {
    padding: 1
  },
  imageContainer: {
    flex: 1,
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    elevation: 2
  },
  serviceImage: {
    width: '50%',
    aspectRatio: 1
  },
  imageTitle: {
    padding: 8,
    fontSize: 14,
    color: Colors.gray[800],
    textAlign: 'center'
  }
});