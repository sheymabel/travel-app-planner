import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';

const dummyResults = [
  { id: '1', title: 'Tunis' },
  { id: '2', title: 'Sidi Bou Said' },
  { id: '3', title: 'Djerba' },
  { id: '4', title: 'Tozeur' },
];

const ScreenSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(dummyResults);

  const handleSearch = (text: string) => {
    setQuery(text);
    const filtered = dummyResults.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search destination..."
        value={query}
        onChangeText={handleSearch}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.resultItem}>{item.title}</Text>}
      />
    </View>
  );
};

export default ScreenSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  searchInput: {
    padding: 10,
    marginBottom: 20,
  },
  resultItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
