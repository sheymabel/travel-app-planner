import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';

import React from 'react'

export default function _layout() {
  useFonts({
    'Outfit': require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Bold.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Medium.ttf'),
  })
  return (
    <Stack>
      <Stack.Screen name="App" options={{headerShown: false}} />
    </Stack>
  );
}