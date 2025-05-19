// src/styles/create-trip/selectDatesStyles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#EDF2F7',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  weekDay: {
    width: 44,
    textAlign: 'center',
    fontWeight: '500',
    color: '#718096',
    fontSize: 12,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  dayCell: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  otherMonthDay: {
    opacity: 0.4,
  },
  otherMonthText: {
    color: '#A0AEC0',
  },
  todayDay: {
    backgroundColor: '#EBF8FF',
  },
  todayText: {
    color: '#3182CE',
    fontWeight: '600',
  },
  selectedDay: {
    backgroundColor: '#3182CE',
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  dayText: {
    color: '#2D3748',
    fontWeight: '500',
  },
});