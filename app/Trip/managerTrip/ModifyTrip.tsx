import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import app from '../../../configs/FirebaseConfig';
import { Colors } from '../../../constants/Colors';

type TripData = {
  city?: string;
  governorate?: string;
  delegation?: string;
  travelType?: string;
  selectedDates?: string[];
};

const db = getFirestore(app);
const auth = getAuth(app);

export default function ModifyTrip() {
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const router = useRouter();

  const [tripData, setTripData] = useState<TripData | null>(null);
  const [city, setCity] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [delegation, setDelegation] = useState('');
  const [travelType, setTravelType] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTripData = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user || !tripId) {
          resetForm();
          return;
        }

        const docRef = doc(db, 'Travler', user.uid, 'trip', tripId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as TripData;
          setTripData(data);
          setCity(data.city || '');
          setGovernorate(data.governorate || '');
          setDelegation(data.delegation || '');
          setTravelType(data.travelType || '');
          
          if (data.selectedDates) {
            const dates = data.selectedDates.map(dateStr => new Date(dateStr));
            setSelectedDates(dates);
          }
        } else {
          Alert.alert('Error', 'Trip not found');
          router.back();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load trip data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  const resetForm = () => {
    setTripData(null);
    setCity('');
    setGovernorate('');
    setDelegation('');
    setTravelType('');
    setSelectedDates([]);
  };

  const handleAddDate = () => {
    setTempDate(new Date());
    setShowDatePicker(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDates([...selectedDates, selectedDate]);
    }
  };

  const removeDate = (index: number) => {
    const newDates = [...selectedDates];
    newDates.splice(index, 1);
    setSelectedDates(newDates);
  };

  const handleModify = () => {
    if (!city || !governorate || selectedDates.length === 0) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }

    if (tripId) {
      router.push({
        pathname: '/Trip/Serch-place',
        params: { tripId }
      });
    } else {
      Alert.alert('Info', 'Please save the trip first before modifying places.');
    }
  };

  const handleSave = async () => {
    if (!city || !governorate || selectedDates.length === 0) {
      Alert.alert('Validation', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const dateStrings = selectedDates.map(date => date.toISOString());

      if (tripId) {
        const docRef = doc(db, 'Travler', user.uid, 'trip', tripId);
        await updateDoc(docRef, {
          city,
          governorate,
          delegation,
          travelType,
          selectedDates: dateStrings,
          updatedAt: new Date().toISOString(),
        });
        Alert.alert('Success', 'Trip updated successfully');
      } else {
        const newTripRef = doc(collection(db, 'Travler', user.uid, 'trip'));
        await setDoc(newTripRef, {
          city,
          governorate,
          delegation,
          travelType,
          selectedDates: dateStrings,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        Alert.alert('Success', 'Trip created successfully');
        router.push('/Trip/managerTrip/mangerTrip');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save trip');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{tripId ? 'Modify Trip' : 'Modify Trip'}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          value={city}
          onChangeText={setCity}
          style={styles.input}
          placeholder="Enter city"
          placeholderTextColor={Colors.gray[400]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Governorate *</Text>
        <TextInput
          value={governorate}
          onChangeText={setGovernorate}
          style={styles.input}
          placeholder="Enter governorate"
          placeholderTextColor={Colors.gray[400]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Delegation</Text>
        <TextInput
          value={delegation}
          onChangeText={setDelegation}
          style={styles.input}
          placeholder="Enter delegation"
          placeholderTextColor={Colors.gray[400]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Travel Type</Text>
        <TextInput
          value={travelType}
          onChangeText={setTravelType}
          style={styles.input}
          placeholder="e.g. business, leisure, family"
          placeholderTextColor={Colors.gray[400]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Trip Dates *</Text>
        <TouchableOpacity style={styles.addDateButton} onPress={handleAddDate}>
          <MaterialIcons name="add" size={20} color={Colors.primary} />
          <Text style={styles.addDateButtonText}>Add Date</Text>
        </TouchableOpacity>
        <View style={styles.datesContainer}>
          {selectedDates.map((date, index) => (
            <View key={index} style={styles.dateItem}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <TouchableOpacity onPress={() => removeDate(index)}>
                <MaterialIcons name="close"  />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{tripId ? 'Save Changes' : 'Create Trip'}</Text>
        </TouchableOpacity>
        
        {tripId && (
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleModify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Modify Places</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => router.push('/Trip/managerTrip/mangerTrip')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.gray[700],
  },
  title: {
    fontSize: 24,
    color: Colors.primary,
    fontFamily: 'outfit-bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.gray[800],
    fontFamily: 'outfit-medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontFamily: 'outfit-regular',
    fontSize: 16,
    backgroundColor: Colors.white,
  },
  addDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  addDateButtonText: {
    color: Colors.primary,
    fontFamily: 'outfit-medium',
    fontSize: 16,
    marginLeft: 8,
  },
  datesContainer: {
    marginTop: 10,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateText: {
    fontFamily: 'outfit-regular',
    color: Colors.gray[800],
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  cancelButton: {
    backgroundColor: Colors.gray[300],
  },
  buttonText: {
    color: Colors.white,
    fontFamily: 'outfit-medium',
    fontSize: 16,
  },
});