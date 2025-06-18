import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function DatePicker({ selectedDate, onChange, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  const [yearRange, setYearRange] = useState([
    new Date().getFullYear() - 4,
    new Date().getFullYear() + 7
  ]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (e.target.closest('.date-picker-popup') === null && 
          e.target.closest('.calendar-button') === null) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const handlePrevYear = () => {
    setCurrentMonth(prevMonth => subYears(prevMonth, 1));
  };

  const handleNextYear = () => {
    setCurrentMonth(prevMonth => addYears(prevMonth, 1));
  };

  const handlePrevYearRange = () => {
    setYearRange(prev => [prev[0] - 12, prev[1] - 12]);
  };

  const handleNextYearRange = () => {
    setYearRange(prev => [prev[0] + 12, prev[1] + 12]);
  };

  const handleDayClick = (day) => {
    onChange(day);
    onClose();
  };

  const handleMonthClick = (month) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(month);
    setCurrentMonth(newDate);
    setViewMode('days');
  };

  const handleYearClick = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setViewMode('months');
  };

  const renderHeader = () => {
    switch (viewMode) {
      case 'days':
        return (
          <div className="date-picker-header">
            <button className="nav-button" onClick={handlePrevMonth} title="Previous Month">
              <ChevronLeft size={16} />
            </button>
            <button 
              className="month-year-selector" 
              onClick={() => setViewMode('months')}
            >
              {format(currentMonth, 'MMMM')}
            </button>
            <button 
              className="month-year-selector" 
              onClick={() => setViewMode('years')}
            >
              {format(currentMonth, 'yyyy')}
            </button>
            <button className="nav-button" onClick={handleNextMonth} title="Next Month">
              <ChevronRight size={16} />
            </button>
          </div>
        );
      case 'months':
        return (
          <div className="date-picker-header">
            <button className="nav-button" onClick={handlePrevYear} title="Previous Year">
              <ChevronLeft size={16} />
            </button>
            <button 
              className="month-year-selector"
              onClick={() => setViewMode('years')}
            >
              {format(currentMonth, 'yyyy')}
            </button>
            <button className="nav-button" onClick={handleNextYear} title="Next Year">
              <ChevronRight size={16} />
            </button>
          </div>
        );
      case 'years':
        return (
          <div className="date-picker-header">
            <button className="nav-button" onClick={handlePrevYearRange} title="Previous Years">
              <ChevronLeft size={16} />
            </button>
            <span className="year-range">
              {yearRange[0]} - {yearRange[1]}
            </span>
            <button className="nav-button" onClick={handleNextYearRange} title="Next Years">
              <ChevronRight size={16} />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const dateFormat = 'EEEEE';
    const days = [];
    const dayNames = [];
    
    // Create day name headers (Sun, Mon, etc)
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      dayNames.push(
        <div key={`header-${i}`} className="day-name">
          {format(day, dateFormat)}
        </div>
      );
    }
    
    // Create calendar days
    const formattedDays = eachDayOfInterval({
      start: startDate,
      end: endDate
    }).map(day => {
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());
      const isSelected = isSameDay(day, selectedDate);
      
      return (
        <button
          key={day.toString()}
          className={`day ${!isCurrentMonth ? 'outside-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {format(day, 'd')}
        </button>
      );
    });
    
    days.push(
      <div key="day-names" className="day-names">
        {dayNames}
      </div>,
      <div key="days" className="days-grid">
        {formattedDays}
      </div>
    );
    
    return <div className="calendar-days">{days}</div>;
  };

  const renderMonths = () => {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentMonth);
      date.setMonth(i);
      const isCurrentMonth = new Date().getMonth() === i && new Date().getFullYear() === currentMonth.getFullYear();
      const isSelected = selectedDate.getMonth() === i && selectedDate.getFullYear() === currentMonth.getFullYear();
      
      months.push(
        <button
          key={i}
          className={`month ${isCurrentMonth ? 'current' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleMonthClick(i)}
        >
          {format(date, 'MMM')}
        </button>
      );
    }
    return <div className="months-grid">{months}</div>;
  };

  const renderYears = () => {
    const years = [];
    for (let year = yearRange[0]; year <= yearRange[1]; year++) {
      const isCurrentYear = new Date().getFullYear() === year;
      const isSelected = selectedDate.getFullYear() === year;
      
      years.push(
        <button
          key={year}
          className={`year ${isCurrentYear ? 'current' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </button>
      );
    }
    return <div className="years-grid">{years}</div>;
  };

  return (
    <div className="date-picker-popup">
      {renderHeader()}
      
      {viewMode === 'days' && renderDays()}
      {viewMode === 'months' && renderMonths()}
      {viewMode === 'years' && renderYears()}
    </div>
  );
}

export default DatePicker; 