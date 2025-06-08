import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../src/styles/create-trip/test';

export default function TestTrip() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundPattern}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Travel Companion</Text>
            <Text style={styles.subtitle}>Plan your perfect journey</Text>
          </View>

          {/* Action Card */}
          <View style={styles.card}>
            <TouchableOpacity 
              style={[styles.button, styles.addButton]}
              onPress={() => router.push('/Trip/Serch-place')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>Create New Trip</Text>
                <Text style={styles.buttonSubtext}>Start a new adventure</Text>
              </View>
            </TouchableOpacity>
            
            <View style={styles.divider} />
            
            <TouchableOpacity 
              style={[styles.button, styles.viewButton]}
              onPress={() => router.push('/traveler/trips')}
              activeOpacity={0.8}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>View My Trips</Text>
                <Text style={styles.buttonSubtext}>See your planned journeys</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Where will you go next?</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

