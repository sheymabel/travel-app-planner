import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter ,} from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function ManagerTrip() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container} >
       <TouchableOpacity
          onPress={() => router.replace('/traveler/trips')}
          style={{ marginTop: -1, padding: 8, borderRadius: 10 }}
        >

          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      <Text style={styles.title }> Manage your Trip</Text>
      
      <View style={styles.cardContainer}>
        <TouchableOpacity 
          style={[styles.card, styles.modifyCard]} 
          onPress={() => router.push('/Trip/managerTrip/ModifyTrip')}
        >
          <MaterialIcons name="edit" size={32} color={Colors.primary} />
          <Text style={styles.cardTitle}>Modify Trip</Text>
          <Text style={styles.cardDescription}>Edit existing trip details</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.card, styles.deleteCard]}         >
          <MaterialIcons name="delete" size={32} />
          <Text style={styles.cardTitle}>Delete Trip</Text>
          <Text style={styles.cardDescription}>Remove unwanted trips</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    padding: 25,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.gray[800],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  modifyCard: {
    borderTopWidth: 4,
    borderTopColor: Colors.primary,
  },
  deleteCard: {
    borderTopWidth: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'outfit-bold',
    color: Colors.gray[800],
    marginTop: 15,
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'outfit-regular',
    color: Colors.gray[600],
    textAlign: 'center',
  },
});