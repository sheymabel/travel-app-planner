import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';


export default function App() {
  const router = useRouter();
  return (
    <View>
      <Image
        source={require('./../assets/images/tunis.png')}
        style={styles.image}
        resizeMode="stretch" // Ensure image keeps its aspect ratio
      />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Tunisia!</Text>
        <Text style={styles.title1}>   Discover the beauty of Tunisia — from Mediterranean beaches to ancient ruins and vibrant souks.
        </Text>

      </View>
      <View style={styles.backButton}>
        <Text  onPress={() => router.push('/scre/Screen1')}
        style={styles.buttonText}> Open</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 450,
    
    // Adjusts based on screen height for responsiveness
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title1:{
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
  backgroundColor:'#0EA5E9',
  borderRadius: 50,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  height: 50,
    width: '50%',
  marginTop: 60,
  marginBottom: 10,
  //this is is to center the button in the screen
  alignSelf: 'center',
},
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
});
