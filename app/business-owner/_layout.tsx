import React, { useEffect } from 'react';  
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';  
import { Tabs } from 'expo-router';  
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';  
import { useNavigation } from 'expo-router';  

// Define Colors  
const Colors = {  
  white: '#FFFFFF',  
  black: '#1F2937',  
  grey: '#9CA3AF',  
  primary: '#0A3D62',  
};  

// Sample components for each tab  

type AddTabBarButtonProps = {
  onPress: () => void;
};

const AddTabBarButton: React.FC<AddTabBarButtonProps> = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.addButtonContainer}>
    <View style={styles.addButton}>
      <Feather name="plus" size={30} color={Colors.white} />
    </View>
  </TouchableOpacity>
);

export default function businessTabsLayout() {  
  const navigation = useNavigation();  

  useEffect(() => {  
    navigation.setOptions({  
      headerShown: false,  
      headerTransparent: true,  
      headerTitle: '',  
    });  
  }, [navigation]);  
const Homebusiness = () => <View><Text>Home</Text></View>;  
const businessServices = () => <View><Text>Services</Text></View>;  
const businessReviews = () => <View><Text>Reviews</Text></View>;  
const businessProfile = () => <View><Text>Profile</Text></View>;  

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
        name="Homebusiness"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="home" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="businessServices"  
        options={{  
          tabBarIcon: ({ color }) => <MaterialIcons name="business-center" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="AddActionScreen"  
        options={{  
          tabBarButton: (props) => <AddTabBarButton {...props} onPress={() => console.log("Add button pressed!")} />,  
        }}  
      />  
      <Tabs.Screen  
        name="businessReviews"  
        options={{  
          tabBarIcon: ({ color }) => <FontAwesome name="star" size={26} color={color} />,  
        }}  
      />  
      <Tabs.Screen  
        name="businessProfile"  
        options={{  
          tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,  
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