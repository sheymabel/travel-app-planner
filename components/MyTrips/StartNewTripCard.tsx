import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../constants/Colors';
import { useRouter } from 'expo-router';

export default function StartNewTripCard() {
    const router = useRouter();

    const handlePress = () => {
        router.push('/apps/Create-trip/Search-place');
    };

    return (
        <View
            style={{
                padding: 25,
                paddingTop: 50,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 50,
            }}
        >
            <Ionicons name="location-sharp" size={24} color="black" />

            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 20,
                    color: 'black',
                    textAlign: 'center',
                }}
            >
                No Trip Planned Yet
            </Text>

            <Text
                style={{
                    fontFamily: 'outfit-medium',
                    fontSize: 15,
                    textAlign: 'center',
                    color: Colors.gray[500],
                }}
            >
                Looks like it's time to plan a new travel experience! Get Started below
            </Text>

            <TouchableOpacity
                onPress={handlePress}
                style={{
                    padding: 15,
                    marginTop: 20,
                    backgroundColor: Colors.primary,
                    borderRadius: 15,
                    paddingHorizontal: 30,
                }}
            >
                <Text
                    style={{
                        color: '#000000',
                        fontFamily: 'outfit',
                        textAlign: 'center',
                    }}
                >
                    Start New Trip
                </Text>
            </TouchableOpacity>
        </View>
    );
}
