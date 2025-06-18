import { useState, useEffect, useRef } from 'react';
import { format, addDays, subDays, startOfToday, parseISO, addMinutes, isSameDay, isToday, addHours } from 'date-fns';
import { PanelRightClose, Calendar1, ChevronLeft, ChevronRight, Calendar, CalendarX } from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import DatePicker from './DatePicker';
import EditEventModal from './EditEventModal';

function CalendarSidebar({ events, onDrop, onEventUpdate, onEventRemove, onGoogleCalendarConnect, isAlwaysOpen = false }) {
  const [isOpen, setIsOpen] = useState(isAlwaysOpen);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timeSlotRefs = useRef({});

  // Update current time every second for smooth dot movement
  useEffect(() => {
    const updateTime = () => setSelectedDate(prevDate => {
      // Only update the time part, keeping the same date
      const newDate = new Date(prevDate);
      const now = new Date();
      newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      return newDate;
    });
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current time on mount and when opening sidebar
  useEffect(() => {
    if (isOpen) {
      const currentHour = new Date().getHours();
      const timeSlotRef = timeSlotRefs.current[`${currentHour}:00`];
      if (timeSlotRef) {
        timeSlotRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isOpen]);

  // Update isOpen when isAlwaysOpen changes
  useEffect(() => {
    if (isAlwaysOpen) {
      setIsOpen(true);
    }
  }, [isAlwaysOpen]);

  const handleTimeSlotClick = (hour, minute) => {
    const selectedTime = new Date(selectedDate);
    selectedTime.setHours(hour);
    selectedTime.setMinutes(minute);
    setSelectedTimeSlot(selectedTime);
  };

  const handleCloseModal = () => {
    setSelectedTimeSlot(null);
  };

  const handleEventClick = (event, e) => {
    // Prevent event bubbling to time slot
    e.stopPropagation();
    setSelectedEvent(event);
  };

  const handleSaveEvent = (updatedEvent) => {
    onEventUpdate(updatedEvent);
    setSelectedEvent(null);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };

  const handleDrop = (e, hour, minute) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const dropTime = new Date(selectedDate);
      dropTime.setHours(hour);
      dropTime.setMinutes(minute);
      
      // Handle different data structures
      if (data.todo) {
        // This is a todo being dropped from TodoItem
        const todo = data.todo;
        const eventData = {
          text: todo.text,
          description: todo.description,
          priority: todo.priority,
          todoId: todo.todoId,
          start: dropTime.toISOString(),
          end: addHours(dropTime, 1).toISOString()
        };
        onDrop(eventData, dropTime);
      } else if (data.event) {
        // This is an event being moved within the calendar
        onDrop(data.event, dropTime);
      } else {
        // Fallback for any other data structure
        onDrop(data, dropTime);
      }
    } catch (error) {
      console.error("Error handling drop:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    try {
      await onGoogleCalendarConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(prevDate => subDays(prevDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsDatePickerOpen(false);
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
    
    // Scroll to current time
    const currentHour = new Date().getHours();
    const timeSlotRef = timeSlotRefs.current[`${currentHour}:00`];
    if (timeSlotRef) {
      timeSlotRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const renderTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = `${hour}:00`;
      const isCurrentHour = new Date().getHours() === hour && isSameDay(selectedDate, new Date());
      
      slots.push(
        <div 
          key={formattedHour}
          className={`time-slot ${isCurrentHour ? 'current-hour' : ''}`}
          ref={el => timeSlotRefs.current[formattedHour] = el}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, hour, 0)}
          onClick={() => handleTimeSlotClick(hour, 0)}
        >
          <div className="time-label">
            {format(new Date().setHours(hour), 'h a')}
          </div>
          <div className="event-area">
            {events
              .filter(event => {
                const eventTime = parseISO(event.start);
                return eventTime.getHours() === hour && isSameDay(eventTime, selectedDate);
              })
              .map(event => (
                <div
                  key={event.id}
                  className={`calendar-event ${event.priority || ''}`}
                  style={{
                    top: `${(parseISO(event.start).getMinutes() / 60) * 100}%`,
                    height: calculateEventHeight(event)
                  }}
                  draggable
                  onClick={(e) => handleEventClick(event, e)}
                  onDragStart={(e) => {
                    e.currentTarget.classList.add('dragging');
                    e.dataTransfer.setData('text/plain', JSON.stringify({ 
                      event: {
                        ...event,
                        // Include the original event ID to help with updating
                        id: event.id
                      } 
                    }));
                  }}
                  onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
                >
                  <span className="event-text">{event.text}</span>
                  <button
                    className="remove-event-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventRemove(event.id);
                    }}
                    title="Remove from calendar"
                  >
                    <CalendarX size={16} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      );

      // Add half-hour slot
      slots.push(
        <div 
          key={`${hour}:30`}
          className="time-slot half-hour"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, hour, 30)}
          onClick={() => handleTimeSlotClick(hour, 30)}
        >
          <div className="event-area" />
        </div>
      );

      // Add current time line
      if (isCurrentHour) {
        const currentMinute = new Date().getMinutes();
        const slotHeight = 27; // Match the CSS height
        const position = (hour * slotHeight) + ((currentMinute / 60) * slotHeight);
        
        slots.push(
          <div
            key="current-time-line"
            className="current-time-line"
            style={{ 
              top: `${position}px`,
            }}
          />
        );
      }
    }
    return slots;
  };

  // Calculate event height based on start and end time
  const calculateEventHeight = (event) => {
    const startTime = parseISO(event.start);
    const endTime = event.end ? parseISO(event.end) : addMinutes(startTime, 30);
    
    // Calculate duration in minutes
    const durationMinutes = (endTime - startTime) / (1000 * 60);
    
    // Convert to percentage of an hour
    const heightPercentage = (durationMinutes / 60) * 100;
    
    // Ensure minimum height
    return `${Math.max(heightPercentage, 5)}%`;
  };

  return (
    <>
      {!isOpen && !isAlwaysOpen && (
        <button
          className="calendar-toggle-trigger"
          onClick={() => setIsOpen(true)}
          title="Open Calendar"
        >
          <Calendar1 />
        </button>
      )}

      <div className={`calendar-sidebar ${isOpen ? 'open' : ''} ${isAlwaysOpen ? 'always-open' : ''}`}>
        <div className="calendar-sidebar-header">
          <div className="date-navigation">
            <button 
              className="nav-button"
              onClick={handlePreviousDay}
              title="Previous Day"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="current-date">{format(selectedDate, 'MMMM d, yyyy')}</h2>
            <button 
              className="nav-button"
              onClick={handleNextDay}
              title="Next Day"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {!isToday(selectedDate) && (
            <button 
              className="today-button"
              onClick={handleTodayClick}
              title="Go to Today"
            >
              Back to Today
            </button>
          )}
          
          <div className="header-actions">
            <div className="date-picker-container">
              <button 
                className="calendar-button"
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                title="Pick a date"
              >
                <Calendar size={20} />
              </button>
              {isDatePickerOpen && (
                <DatePicker 
                  selectedDate={selectedDate}
                  onChange={handleDateChange}
                  onClose={() => setIsDatePickerOpen(false)}
                />
              )}
            </div>
            <button 
              className="google-calendar-button"
              onClick={handleGoogleConnect}
              disabled={isConnecting}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
              </svg>
              {isConnecting ? 'Connecting...' : 'Connect Google Calendar'}
            </button>
            {!isAlwaysOpen && (
              <button 
                className="action-button"
                onClick={() => setIsOpen(false)}
                title="Close Calendar"
              >
                <PanelRightClose />
              </button>
            )}
          </div>
        </div>

        <div className="calendar-view">
          <div className="time-slots">
            {renderTimeSlots()}
          </div>
        </div>
      </div>

      {selectedTimeSlot && (
        <AddTaskModal
          onAdd={(task) => {
            // Convert the task to an event
            const eventStart = selectedTimeSlot;
            const eventEnd = addMinutes(selectedTimeSlot, 30);
            onEventUpdate({
              ...task,
              start: eventStart.toISOString(),
              end: eventEnd.toISOString(),
              isOnCalendar: true
            });
            handleCloseModal();
          }}
          onClose={handleCloseModal}
          initialDate={selectedTimeSlot}
        />
      )}

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onSave={handleSaveEvent}
          onClose={handleCloseEventModal}
        />
      )}
    </>
  );
}

export default CalendarSidebar; 