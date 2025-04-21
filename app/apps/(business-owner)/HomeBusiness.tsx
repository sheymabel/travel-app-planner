// app/auth/BusinessOwner/index.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';

export default function BusinessOwner() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  const menuItems = [
    { name: 'Profile', icon: 'user-edit', color: Colors.primary },
    { name: 'Services', icon: 'concierge-bell', color: '#10b981' },
    { name: 'Reservations', icon: 'calendar-check', color: '#f59e0b' },
    { name: 'Reviews', icon: 'star', color: '#ef4444' },
    { name: 'Artwork', icon: 'images', color: '#3b82f6' },
    { name: 'Details', icon: 'info-circle', color: '#6b7280' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Business Dashboard</Text>
        <Text style={styles.subtitle}>Manage your business operations</Text>

        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.name}
              style={[
                styles.cardContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    { scale: scaleAnim },
                    { translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    })},
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => navigateTo(item.name)}
                activeOpacity={0.7}
              >
                <FontAwesome5 name={item.icon} size={24} color={item.color} />
                <Text style={styles.cardText}>{item.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bgColor,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[600],
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray[800],
    textAlign: 'center',
  },
});
