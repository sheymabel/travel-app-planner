// calendarTypes.ts

export type CalendarDay = {
  day: number;
  month: 'prev' | 'current' | 'next';
  date: Date;
};
