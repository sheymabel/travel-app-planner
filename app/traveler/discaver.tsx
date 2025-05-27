import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../configs/FirebaseConfig'; // adapte ce chemin à ta config Firebase
import { Colors } from '../../constants/Colors'; // adapte ou remplace par tes couleurs

interface Service {
  id: string;
  title?: string;
  name?: string;
  image?: string;
  images?: string[];
  duration?: string;
  price?: string | number;
  rating?: number;
  businessId?: string;
}

interface Trip {
  id: string;
  city?: string;
  governorate?: string;
  delegation?: string;
  travelType?: string;
  selectedDates?: string[];
}

interface Business {
  id: string;
  name: string;
  city: string;
  services: Service[];
}

export default function Discover() {
  const [userId, setUserId] = useState<string | null>(null);
  const [travelerCities, setTravelerCities] = useState<string[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setBusinesses([]);
      setLoading(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        // 1. Récupérer trips du voyageur
        const tripRef = collection(db, 'trip');
        const tripQuery = query(tripRef, where('userId', '==', userId));
        const tripSnapshot = await getDocs(tripQuery);

        const citiesSet = new Set<string>();
        tripSnapshot.forEach(doc => {
          const data = doc.data() as Trip;
          // Choisir city, governorate, ou delegation
          const city = data.city || data.governorate || data.delegation;
          if (city) {
            citiesSet.add(city.toString().toLowerCase());
          }
        });
        const citiesArray = Array.from(citiesSet);
        setTravelerCities(citiesArray);

        if (citiesArray.length === 0) {
          setBusinesses([]);
          setLoading(false);
          return;
        }

        // 2. Récupérer businesses dans ces villes
        const businessRef = collection(db, 'business');
        const businessSnapshot = await getDocs(businessRef);

        const matchedBusinesses = businessSnapshot.docs
          .map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name,
              city: data.city,
            };
          })
          .filter(business =>
            business.city &&
            citiesArray.includes(business.city.toLowerCase())
          );

        // 3. Récupérer services pour chaque business filtré
        const businessesWithServices: Business[] = [];

        for (const business of matchedBusinesses) {
          const servicesRef = collection(db, 'business', business.id, 'services');
          const servicesSnapshot = await getDocs(servicesRef);

          const services = servicesSnapshot.docs.map(snap => {
            const data = snap.data();
            return {
              id: snap.id,
              title: data.title,
              name: data.name,
              image: data.image,
              images: data.images,
              duration: data.duration,
              price: data.price,
              rating: data.rating,
              businessId: business.id,
            };
          }) as Service[];

          businessesWithServices.push({
            id: business.id,
            name: business.name,
            city: business.city,
            services,
          });
        }

        setBusinesses(businessesWithServices);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary || 'blue'} />
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Veuillez vous connecter pour découvrir les services.</Text>
      </View>
    );
  }

  if (businesses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Services disponibles</Text>
        <Text>Aucun business trouvé dans vos villes de voyage.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={styles.title}>Services dans vos villes de voyage</Text>

      {businesses.map(business => (
        <View key={business.id} style={styles.businessSection}>
          <Text style={styles.businessName}>{business.name} ({business.city})</Text>

          {business.services.length === 0 ? (
            <Text>Aucun service disponible</Text>
          ) : (
            business.services.map(service => {
              const serviceTitle = service.title || service.name || 'Service sans nom';
              const imageUrl = service.image || (service.images && service.images[0]) || null;
              const priceNumber = typeof service.price === 'string' ? parseFloat(service.price) : service.price;

              return (
                <View key={service.id} style={styles.serviceCard}>
                  {imageUrl && (
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.serviceImage}
                      resizeMode="cover"
                    />
                  )}
                  <Text style={styles.serviceName}>{serviceTitle}</Text>
                  {service.duration && <Text>Durée : {service.duration}</Text>}
                  {priceNumber !== undefined && !isNaN(priceNumber) && (
                    <Text>Prix : ${priceNumber.toFixed(2)}</Text>
                  )}
                  {service.rating !== undefined && (
                    <Text>Note : {service.rating} / 5</Text>
                  )}
                </View>
              );
            })
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#007AFF' },
  businessSection: { marginBottom: 30 },
  businessName: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  serviceCard: { marginBottom: 16, backgroundColor: '#F0F0F0', padding: 12, borderRadius: 10 },
  serviceImage: { width: '100%', height: 140, borderRadius: 8, marginBottom: 8 },
  serviceName: { fontSize: 18, fontWeight: '500' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
