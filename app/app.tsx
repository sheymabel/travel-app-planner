import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import HomePage from './apps/(home)/index';

export default function Home() {
  
  return (
    <View style={styles.container}>
<HomePage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold',
  },
});
