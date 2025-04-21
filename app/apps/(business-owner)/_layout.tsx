import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome, MaterialIcons, Entypo } from '@expo/vector-icons';
import { View } from 'react-native';
import { Colors } from '../../../constants/Colors';

export default function BusinessTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 0,
          paddingBottom: 6,
          height: 60,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="HomeBusiness"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="BusinessServices" 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="construct-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="BusinessReservations"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: focused ? Colors.primary : '#ccc',
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: -20,
              }}
            >
              <Entypo name="calendar" size={24} color={Colors.white} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="BusinessReviews"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="BusinessProfile"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
