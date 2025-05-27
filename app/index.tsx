import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleNavigation = () => {
      router.push('/screens/Screen1'); // Must match file path
 
  };

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require('../assets/images/tunis.png')} // ✅ Make sure this image exists
        style={styles.image}
        resizeMode="stretch"
      />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Tunisia!</Text>
        <Text style={styles.title1}>
          Discover the beauty of Tunisia — from Mediterranean beaches to ancient ruins and vibrant souks.
        </Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={handleNavigation}>
        <Text style={styles.buttonText}>Open</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 450,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 30,
    paddingTop: 20,
  },
  title1: {
    fontSize: 15,
    color: '#839096FF',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#3A4042FF',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20,
  },
  backButton: {
    padding: 5,
    backgroundColor: '#0EA5E9',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '50%',
    marginTop: 60,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
});
