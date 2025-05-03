import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

const categories = [
  { id: '1', title: 'Culture' },
  { id: '2', title: 'Adventure' },
  { id: '3', title: 'Nature' },
  { id: '4', title: 'Relaxation' },
  { id: '5', title: 'Historical' },
];

const ScreenCategory = () => {
  const renderCategoryItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore by Category</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ScreenCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
