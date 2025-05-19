import React from 'react';
import { View, Text,StyleSheet,TouchableOpacity } from 'react-native';
import SearchResult from '../../components/MyTrips/SearchResult';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
 const router = useRouter();

  const handleNavigation = () => {
      router.push('/Trip/TravelingScreen'); // Must match file path
 
  };
export const SearchPlace = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
        Find Places in Tunisia
      </Text>
      <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 20 ,color:Colors.gray[600] }}>
          Loks like its time  to plan a new travel experinece ! Get  Strated 
        </Text>
       <TouchableOpacity style={styles.backButton} onPress={handleNavigation}>
              <Text style={styles.buttonText}>Start a new trip</Text>
            </TouchableOpacity>
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
 
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
    backgroundColor: '#2BAFECFF',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '40%',
    marginTop: 60,
    marginBottom: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#F9FBFCFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 17,
  },
});
