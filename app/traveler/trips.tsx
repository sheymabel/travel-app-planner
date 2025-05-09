import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '../Create-trip/Search-place';
import React, { useState, useEffect } from 'react';
  import { useNavigation, useRouter } from 'expo-router';


export default function TripsScreen() {
  const [useTrip,setUserTrip] = useState([]);
  const [useTripDetails,setUserTripDetails] = useState([]);
  const [useTripDetailsId,setUserTripDetailsId] = useState([]);
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
    <SafeAreaView style={styles.container}>
      
    <View
     style={{padding:25,
        paddingTop:55,
        backgroundColor:Colors.white,
        height:'100%',
     }}>
        <View 
        style={{
            display:'flex',
            flexDirection:'row',
            alignContent:'center',
            justifyContent:'space-between',
        }}
        >
        <Text 
         style={{fontFamily:'outfit-bold',
            fontSize:26,
         }}
            >My Trip</Text>
          <Ionicons name="add-circle-sharp" size={40} color="black" />

        </View>
    {useTrip.length === 0 ?
    <StartNewTripCard/>:
    null    }
   
    </View>
    </SafeAreaView>

 );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
}); 