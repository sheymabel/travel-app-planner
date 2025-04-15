// app/auth/BusinessOwner/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BusinessOwnerDashboard() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    // Vérifiez que le chemin correspond à une route valide définie dans votre projet
    const validPaths = [
      'BusinessProfile',
      'BusinessServices',
      'BusinessReservations',
      'BusinessReviews',
      'BusinessUploadArtwork',
    ];
    
    if (validPaths.includes(path)) {
      router.push(`/auth/BusinessOwner/Business${path}` as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <Text style={styles.title}>Business Dashboard</Text>
        <Text style={styles.subtitle}>Manage your business operations</Text>

        <View style={styles.grid}>
          {[
            { name: 'Profile', icon: 'user-edit', color: '#4f46e5' },
            { name: 'Services', icon: 'concierge-bell', color: '#10b981' },
            { name: 'Reservations', icon: 'calendar-check', color: '#f59e0b' },
            { name: 'Reviews', icon: 'star', color: '#ef4444' },
            { name: 'Artwork', icon: 'images', color: '#3b82f6' },
            { name: 'Details', icon: 'info-circle', color: '#6b7280' },
          ].map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.card}
              onPress={() => navigateTo(item.name)}
            >
              <FontAwesome5 name={item.icon} size={24} color={item.color} />
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
});
