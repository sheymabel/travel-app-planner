import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../src/styles/business-owner/buisnesservice';

interface Service {
  id: string;
  name: string;
  date: string;
  time: string;
  provider: string;
  rating: string;
  reviews: string;
  status: string;
}

const ServiceManagementScreen = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([
    {
      id: '#524587',
      name: 'Home Cleaner',
      date: '22 Sep 21',
      time: '03:00 - 04:30 PM',
      provider: 'Levity Ray',
      rating: '4.7',
      reviews: '192 Ratings',
      status: 'Active'
    },
  ]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const ServiceCard = ({ service }: { service: Service }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{service.status}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push(`/Service/EditServiceScreen`)}
          style={styles.editButton}
        >
          <Ionicons name="create-outline" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.serviceName}>{service.name}</Text>
      
      <View style={styles.timeContainer}>
        <Ionicons name="time-outline" size={16} color="#6B7280" />
        <Text style={styles.serviceTime}>{service.date} • {service.time}</Text>
      </View>

      <View style={styles.providerContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{service.provider}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.ratingText}>{service.rating}</Text>
            <Text style={styles.reviewsText}>({service.reviews})</Text>
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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Services</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/Service/add')}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.addButtonText}>New Service</Text>
        </TouchableOpacity>
      </View>

      {/* Services List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </ScrollView>

      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this service permanently? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.confirmDeleteButton]}
                onPress={() => {
                  setServices(services.filter(s => s.id !== selectedService?.id));
                  setShowDeleteModal(false);
                }}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default ServiceManagementScreen;