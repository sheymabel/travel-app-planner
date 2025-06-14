import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Using only Ionicons for simplicity
import { useNavigation } from 'expo-router';

// Define Colors
const Colors = {
  white: '#FFFFFF',
  black: '#1F2937',
  grey: '#9CA3AF',
  primary: '#0A3D62',
};

// Custom Add Button Component
type AddTabBarButtonProps = {
  onPress: () => void;
};

const AddTabBarButton: React.FC<AddTabBarButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.addButtonContainer}>
    <View style={styles.addButton}>
      <Ionicons name="add" size={24} color={Colors.white} /> {/* Using Ionicons add icon */}
    </View>
  </TouchableOpacity>
);

export default function Layout() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, [navigation]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 65,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: Colors.grey,
      }}
    >
      <Tabs.Screen
        name="HomeBusiness" // Matches your existing route
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="BusinessServices" // Matches your existing route
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="business" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="BusinessReviews" // Matches your existing route
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="BusinessProfile" // Matches your existing route
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="businessAddAction" // New route to be created
        options={{
          tabBarButton: (props) => <AddTabBarButton {...props} onPress={() => console.log("Add button pressed!")} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#A3B3F0FF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});