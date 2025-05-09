// styles/MapboxStyles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  searchBox: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#888',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  map: {
    flex: 1,
    minHeight: 300,
  },
  userMarker: {
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  searchMarker: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 2,
  },
  resultsList: {
    marginTop: 10,
  },
  resultItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
});
