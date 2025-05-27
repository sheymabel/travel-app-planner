import React from 'react';
import { View, Text } from 'react-native';
import SearchResult from '../../components/MyTrips/SearchResult';

export const SearchPlace = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 20 }}>
        Find Places in Tunisia
      </Text>
    </View>
  );
};

export default SearchPlace;
