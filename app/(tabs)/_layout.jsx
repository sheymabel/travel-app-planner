import React, { useState } from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import{Colors} from '../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function TabsLayout() {
    const[tripData,setTripData] = useState([]);
  return (
    <><CreateTripContext.Provider value={{ tripData, setTripData }} /><Tabs screenOptions={{
          headerShown: false,
          TabActionsTintColor: Colors.Primary,
          tabBarLabelPosition: 'below-icon',
      }}>
          <Tabs.Screen name="mytrip"
              options={{
                  tabBarIcon: ({ color }) => (
                      <Ionicons name="location-sharp" size={24} color={color} />
                  ),

                  title: 'My Trip',
              }} />
          <Tabs.Screen name="discaver" options={{
              tabBarIcon: ({ color }) => (
                  <Ionicons name="globe-sharp" size={24} color={color} />
              ),

              title: 'Discover',
          }} />
          <Tabs.Screen name="profile" options={{
              tabBarIcon: ({ color }) => (
                  <Ionicons name="person-circle-outline" size={24} color={color} />
              ),

              title: 'Profile',
          }} />


      </Tabs></>
  )
}