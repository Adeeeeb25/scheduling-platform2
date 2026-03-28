import React, { useState, useEffect } from 'react';
import { parseDate } from '../services/api';
import './Calendar.css';

const Calendar = ({ onDateSelect, selectedDate, dateFrom, dateTo }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Log received dates for debugging
  useEffect(() => {
    console.log('Calendar received dates:', { dateFrom, dateTo });
  }, [dateFrom, dateTo]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (selected >= new Date()) {
      onDateSelect(selected);
    }
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateSelected = (day) => {
    if (!day || !selectedDate) return false;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.getTime() === selectedDate.getTime();
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    date.setHours(0, 0, 0, 0); // Normalize to midnight for fair comparison

    // Check if date is in the past
    if (date < today) return true;

    // Check if date is before dateFrom (inclusive)
    if (dateFrom) {
      const fromDate = parseDate(dateFrom);
      if (fromDate) {
        // Create a fresh copy for comparison without mutation
        const fromDateNormalized = new Date(fromDate);
        fromDateNormalized.setHours(0, 0, 0, 0);
        if (date < fromDateNormalized) {
          console.log(`Day ${day} disabled: before dateFrom ${dateFrom}`);
          return true;
        }
      }
    }

    // Check if date is after dateTo (inclusive - date should be <= dateTo)
    if (dateTo) {
      const toDate = parseDate(dateTo);
      if (toDate) {
        // Create a fresh copy for comparison without mutation
        const toDateNormalized = new Date(toDate);
        toDateNormalized.setHours(0, 0, 0, 0);
        if (date > toDateNormalized) {
          console.log(`Day ${day} disabled: after dateTo ${dateTo}`);
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="calendar-nav">
          ←
        </button>
        <h3>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={handleNextMonth} className="calendar-nav">
          →
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {days.map((day, index) => (
          <button
            key={index}
            className={`calendar-day ${isDateSelected(day) ? 'selected' : ''} ${
              isDateDisabled(day) ? 'disabled' : ''
            }`}
            onClick={() => !isDateDisabled(day) && handleDateClick(day)}
            disabled={isDateDisabled(day)}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
