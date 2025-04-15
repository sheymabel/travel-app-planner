import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import StartNewTripCard from '@/components/MyTrips/StartNewTripCard';



export default function mytrip() {
  const [useTrip,setUserTrip] = useState([]);
const [useTripDetails,setUserTripDetails] = useState([]);
const [useTripDetailsId,setUserTripDetailsId] = useState([]);

  return (
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
  )
}

