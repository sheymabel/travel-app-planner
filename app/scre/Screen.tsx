import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const { width, height } = Dimensions.get('window');
  const router = useRouter();

export default function Screen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
   
    });
  }, []);
  
  return (
    <View style={styles.container} >
      <View style={styles.imageContainer}>
        <Image
        style={{ width: '100%', height: height * 0.49 , resizeMode: 'contain', // Ensure image keeps its aspect ratio
        }}
          source={require('./../../assets/images/login2.png')}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleBold}>Customize your
        High-end travel
        </Text>

        <Text style={styles.subtitle}>
          Countless high-end {'\n'}
          entertainment facilities
        </Text>

        <TouchableOpacity   onPress={() => router.replace('/scre/Screen1') }  style={styles.playButton}>
      
          <Ionicons name="play" size={32} color="white" style={styles.playIcon} />
        </TouchableOpacity>

        <View style={styles.sponsorBadge}>
          <MaterialCommunityIcons name="flash" size={16} color="#FFD700" />
          <Text style={styles.sponsorText}>Nordic Vacation Sponsor</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    paddingTop: 20,
  },
 
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 40,
    position: 'relative',
  },
  title: {
    fontSize: 28,
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: 'System',
  },
  titleBold: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    color:    '#9ca3af',

    textDecorationLine: 'underline',
    fontFamily: 'System',
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
    marginBottom: 40,
  },
  playIcon: {
    marginLeft: 4,
  },
  sponsorBadge: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFFFF',
  },
  sponsorText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'System',
  },
});



