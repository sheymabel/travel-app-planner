
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
  import { useNavigation, useRouter } from 'expo-router';
const highlights = [
  {
    id: '1',
    title: 'Ksar Ghilane',
    image: 'https://source.unsplash.com/featured/?desert,tunisia',
    icon: 'earth-outline',
  },
  {
    id: '2',
    title: 'Sidi Bou Said',
    image: 'https://source.unsplash.com/featured/?sidi-bou-said',
    icon: 'sunny-outline',
  },
  {
    id: '3',
    title: 'Amphitheatre of El Jem',
    image: 'https://source.unsplash.com/featured/?amphitheatre,tunisia',
    icon: 'business-outline',
  },
];

export default function Discaver() {
  
    const navigation = useNavigation();
    const router = useRouter();
  
  useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerTransparent: true,
        headerTitle: '',
     
      });
    }
    , []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Tunisia</Text>
      <FlatList
        data={highlights}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInUp.delay(index * 150).duration(500)}
            style={styles.card}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Ionicons name={item.icon as any} size={24} color="#ff5722" style={styles.icon} />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#333',
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#fafafa',
    overflow: 'hidden',
    elevation: 2,
    boxShadow: "0px 2px 3.84px rgba(0, 0, 0, 0.25)"
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  icon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
});
