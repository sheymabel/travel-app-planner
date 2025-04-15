import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from './../../constants/Colors';
import { CreateTripContext } from '../../context/CreateTripContext';

export default function TabsLayout() {
    const [tripData, setTripData] = useState([]);

    return (
        <CreateTripContext.Provider value={{ tripData, setTripData }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors.light, // Correction de `TabActionsTintColor` en `tabBarActiveTintColor`
                    tabBarLabelPosition: 'below-icon',
                }}
            >
                <Tabs.Screen
                    name="BusinessOwnerDashboard"
                    options={{
                        tabBarIcon: ({ color }: { color: string }) => (
                            <Ionicons name="location-sharp" size={24} color={color} />
                        ),
                        title: 'Home',
                    }}
                />
                <Tabs.Screen
                    name="BusinessReservationsScreen"
                    options={{
                        tabBarIcon: ({ color }: { color: string }) => (
                            <Ionicons name="globe-sharp" size={24} color={color} />
                        ),
                        title: 'Reservations',
                    }}
                />
                <Tabs.Screen
                    name="BusinessServicesScreen"
                    options={{
                        tabBarIcon: ({ color }: { color: string }) => (
                            <Ionicons name="globe-sharp" size={24} color={color} />
                        ),
                        title: 'Services',
                    }}
                />
                <Tabs.Screen
                    name="BusinessProfileScreen"
                    options={{
                        tabBarIcon: ({ color }: { color: string }) => (
                            <Ionicons name="person-circle-outline" size={24} color={color} />
                        ),
                        title: 'Profile',
                    }}
                />
            </Tabs>
        </CreateTripContext.Provider>
    );
}