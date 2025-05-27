import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from '../../src/styles/create-trip/date';
import { CalendarDay } from '../../models/calendarTypes';

export default function CalendarScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams(); // ✅ receive tripId
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<number[]>([]);

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
      const user = getAuth().currentUser;
      if (!user || !tripId) {
        Alert.alert('Error', 'Missing user or trip ID');
        return;
      }

      const formattedDates = selectedDates.map(t =>
        new Date(t).toISOString().split('T')[0]
      );

      const tripRef = doc(db, 'Travler', user.uid, 'trip', String(tripId));
      await updateDoc(tripRef, {
        selectedDates: formattedDates,
      });

      Alert.alert('Dates saved!');
      router.push({
        pathname: '/traveler/trips',
        params: { tripId },
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
        onPress={() => router.back()}
        style={{ marginTop: -40, padding: 8, borderRadius: 10 }}
      >
        <Ionicons name="arrow-back" size={24} color={Colors.black} />
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
                  <Text
                    style={[
                      styles.dayText,
                      day.month !== 'current' && styles.otherMonthText,
                      isSelected && styles.selectedText,
                    ]}
                  >
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
              ? `Continue (${selectedDates.length})`
              : 'Select dates'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
