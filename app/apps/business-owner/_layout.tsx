import React, { useEffect } from 'react';  
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';  
import { Tabs } from 'expo-router';  
import { Ionicons, Feather } from '@expo/vector-icons';  
import { useNavigation } from 'expo-router';  

// Define Colors  
const Colors = {  
  white: '#FFFFFF',  
  black: '#1F2937',  
  grey: '#9CA3AF',  
  primary: '#0A3D62',  
};  

// Sample components for each tab  
const HomeBusiness = () => <View><Text>Home</Text></View>;  
const BusinessServices = () => <View><Text>Services</Text></View>;  
const BusinessReviews = () => <View><Text>Reviews</Text></View>;  
const BusinessProfile = () => <View><Text>Profile</Text></View>;  

// Custom button for the tab bar  
const AddTabBarButton = ({ onPress }) => (  
  <TouchableOpacity  
    onPress={onPress}  
    style={styles.addButtonContainer}  
  >  
    <View style={styles.addButton}>  
      <Feather name="plus" size={30} color={Colors.white} />  
    </View>  
  </TouchableOpacity>  
);  

export default function BusinessTabsLayout() {  
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
        name="HomeBusiness"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="BusinessServices"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="briefcase-outline" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="AddActionScreen"  
        options={{  
          tabBarButton: (props) => <AddTabBarButton {...props} onPress={() => console.log("Add button pressed!")} />,  
        }}  
      />  
      <Tabs.Screen  
        name="BusinessReviews"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses-outline" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="BusinessProfile"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="person-circle-outline" size={28} color={color} />,  
        }}  
      />  
    </Tabs>  
  );  
}  

const styles = StyleSheet.create({  
  addButtonContainer: {  
    top: -30,  
    justifyContent: 'center',  
    alignItems: 'center',  
    shadowColor: "#000",  
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
