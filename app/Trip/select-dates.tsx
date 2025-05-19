import React, { useState ,useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CalendarDay } from '../../models/calendarTypes';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from 'expo-router';

const CalendarScreen: React.FC = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const navigation = useNavigation();



  const generateCalendar = (date: Date): CalendarDay[][] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevMonthLastDay = new Date(year, month, 0);

    const calendar: CalendarDay[] = [];
    const startDay = (firstDay.getDay() + 6) % 7;
    const endDay = (7 - ((lastDay.getDay() + 6) % 7)) % 7;

    for (let i = startDay - 1; i >= 0; i--) {
      calendar.push({
        day: prevMonthLastDay.getDate() - i,
        month: 'prev',
        date: new Date(year, month - 1, prevMonthLastDay.getDate() - i),
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      calendar.push({
        day: i,
        month: 'current',
        date: new Date(year, month, i),
      });
    }

    for (let i = 1; i <= endDay; i++) {
      calendar.push({
        day: i,
        month: 'next',
        date: new Date(year, month + 1, i),
      });
    }

    const weeks: CalendarDay[][] = [];
    while (calendar.length) {
      weeks.push(calendar.splice(0, 7));
    }
    return weeks;
  };

  const changeMonth = (direction: 'next' | 'prev') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const toggleDate = (date: Date) => {
    const timestamp = date.getTime();
    setSelectedDates(prev =>
      prev.includes(timestamp)
        ? prev.filter(t => t !== timestamp)
        : [...prev, timestamp]
    );
  };

  const formatMonthYear = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

  const saveToFirestore = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      const formattedDates = selectedDates.map(t =>
        new Date(t).toISOString().split('T')[0]
      );

      const tripCollectionRef = collection(db, 'Travler', user.uid, 'trip');
      const tripDoc = await addDoc(tripCollectionRef, {
        selectedDates: formattedDates,
      });

      Alert.alert('Success', 'Trip dates saved');
      router.replace({
        pathname: '/traveler/trips',
        params: { tripId: tripDoc.id },
      });
    } catch (error) {
      console.error('Error saving dates:', error);
      Alert.alert('Error', 'Could not save your trip dates');
    }
  };

  const weeks = generateCalendar(currentDate);

  return (
    <View style={styles.container}>
          <TouchableOpacity
        onPress={() => router.replace('/Trip/TravelingScreen')}
        style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
        <Text style={{ display: 'none' }}>Back Button</Text>
      </TouchableOpacity>
                      <Text style={styles.title}>Travel Dates</Text>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')}>
          <MaterialIcons name="navigate-before" size={28} color="#6c5ce7" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{formatMonthYear(currentDate)}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')}>
          <MaterialIcons name="navigate-next" size={28} color="#6c5ce7" />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <Text key={day} style={styles.weekDay}>{day}</Text>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.calendarContainer}>
        {weeks.map((week, index) => (
          <View key={index} style={styles.weekRow}>
            {week.map((day, i) => {
              const isSelected = selectedDates.includes(day.date.getTime());
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dayCell,
                    day.month !== 'current' && styles.otherMonthDay,
                    isSelected && styles.selectedDay,
                  ]}
                  onPress={() => toggleDate(day.date)}
                >
                  <Text style={[
                    styles.dayText,
                    day.month !== 'current' && styles.otherMonthText,
                    isSelected && styles.selectedText
                  ]}>
                    {day.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
         <TouchableOpacity 
        style={styles.saveButton} 
        onPress={saveToFirestore}
        disabled={selectedDates.length === 0}
      >
        <Text style={styles.saveText}>
          {selectedDates.length > 0 
            ? `Continue (${selectedDates.length} )` 
            : 'Select dates '}
        </Text>
      </TouchableOpacity>
      </ScrollView>

     
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: { 
    marginTop:25,
alignContent:'center',
    flex: 1, 
    padding: 20, 
  },
  header: {
     marginTop:70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  monthText: { 
    fontSize: 19, 
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: 0.5,
  },
   title: {
    marginTop:50,
    fontSize: 25,
    fontWeight: '700',
    color: '#313641FF',
    marginBottom: 8,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  weekDay: { 
    width: 44, 
    textAlign: 'center', 
    fontWeight: '600',
    color: '#636e72',
    fontSize: 14,
  },
  calendarContainer: {
    paddingBottom: 20,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
  },
  dayCell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 2,
  },
  otherMonthDay: {
    backgroundColor: 'transparent',
  },
  selectedDay: {
    backgroundColor: '#6FB8FCFF',
    shadowColor: '#6FB8FCFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dayText: { 
    color: '#2d3436', 
    fontSize: 16,
    fontWeight: '500',
  },
  otherMonthText: {
    color: '#b2bec3',
  },
  selectedText: {
    color: '#fff',
  },
  saveButton: {
    marginTop:50,
    marginHorizontal: 100,
    backgroundColor: '#6FB8FCFF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    opacity: 0.9,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});