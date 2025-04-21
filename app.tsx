import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useAuth from './../travel-app-planner/configs/app.configs'; // Assuming this is the correct hook file

// Import your screens here
import HomeScreen from './app/apps/(home)/index';
import LoginScreen from './../travel-app-planner/app/auth/sign-in';
import ProfileScreen from './app/apps/(traveler)/index';

const Stack = createStackNavigator();



export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Optional: StatusBar configuration */}
      <StatusBar barStyle="dark-content" />

      <NavigationContainer>
      <Stack.Screen name="(home)" component={HomeScreen} />
      </NavigationContainer>
    </SafeAreaView>
  );
}
