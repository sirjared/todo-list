import { useState } from 'react';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isWithinInterval } from 'date-fns';
import { Plus } from 'lucide-react';
import TodoItem from './TodoItem';
import AddTaskModal from './AddTaskModal';

function WeeklyReview({ 
  todos, 
  events, 
  onToggleTodo, 
  onDeleteTodo, 
  onEditTodo, 
  onAddTodo, 
  onAddToCalendar,
  onCalendarDrop,
  onEventUpdate,
  onEventRemove
}) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [notes, setNotes] = useState(localStorage.getItem('weeklyNotes') || '');
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })); // Start on Monday
  
  // Save notes to localStorage when they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem('weeklyNotes', newNotes);
  };
  
  // Get the days of the current week
  const weekDays = eachDayOfInterval({
    start: currentWeekStart,
    end: endOfWeek(currentWeekStart, { weekStartsOn: 1 })
  });
  
  // Navigate to previous week
  const handlePreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };
  
  // Navigate to next week
  const handleNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };
  
  // Get todos for a specific day
  const getTodosForDay = (day) => {
    return todos.filter(todo => {
      if (!todo.scheduledFor) return false;
      const todoDate = parseISO(todo.scheduledFor);
      return format(todoDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };
  
  // Get todos for the current week
  const getWeeklyTodos = () => {
    const weekStart = currentWeekStart;
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    
    return todos.filter(todo => {
      if (!todo.scheduledFor) return false;
      const todoDate = parseISO(todo.scheduledFor);
      return isWithinInterval(todoDate, { start: weekStart, end: weekEnd });
    });
  };
  
  // Get unscheduled todos
  const getUnscheduledTodos = () => {
    return todos.filter(todo => !todo.scheduledFor);
  };
  
  return (
    <div className="weekly-review">
      <div className="weekly-review-header">
        <div className="week-navigation">
          <button onClick={handlePreviousWeek} className="nav-button">Previous Week</button>
          <h1>Week of {format(currentWeekStart, 'MMM d, yyyy')}</h1>
          <button onClick={handleNextWeek} className="nav-button">Next Week</button>
        </div>
        <button 
          className="add-task-button main-add-button"
          onClick={() => setIsAddTaskModalOpen(true)}
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>
      
      <div className="weekly-calendar">
        <div className="week-days-header">
          {weekDays.map(day => (
            <div key={format(day, 'yyyy-MM-dd')} className="week-day-header">
              <span className="day-name">{format(day, 'EEE')}</span>
              <span className="day-date">{format(day, 'd')}</span>
            </div>
          ))}
        </div>
        
        <div className="week-days-content">
          {weekDays.map(day => (
            <div key={format(day, 'yyyy-MM-dd')} className="week-day-column">
              <div className="day-events">
                {events
                  .filter(event => {
                    const eventDate = parseISO(event.start);
                    return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
                  })
                  .sort((a, b) => parseISO(a.start) - parseISO(b.start))
                  .map(event => (
                    <div 
                      key={event.id} 
                      className={`week-event ${event.priority || ''}`}
                    >
                      <div className="event-time">
                        {format(parseISO(event.start), 'h:mm a')}
                      </div>
                      <div className="event-text">{event.text}</div>
                    </div>
                  ))
                }
              </div>
              
              <div className="day-todos">
                {getTodosForDay(day).map(todo => (
                  <div key={todo.id} className="week-todo-item">
                    <TodoItem
                      todo={todo}
                      onToggle={onToggleTodo}
                      onDelete={onDeleteTodo}
                      onEdit={onEditTodo}
                      onAddToCalendar={onAddToCalendar}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="weekly-review-sections">
        <div className="unscheduled-todos-section">
          <h2>Unscheduled Tasks</h2>
          <div className="unscheduled-todos-list">
            {getUnscheduledTodos().length > 0 ? (
              getUnscheduledTodos().map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggleTodo}
                  onDelete={onDeleteTodo}
                  onEdit={onEditTodo}
                  onAddToCalendar={onAddToCalendar}
                />
              ))
            ) : (
              <div className="empty-state">
                <p>No unscheduled tasks.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="notes-section">
          <h2>Weekly Notes</h2>
          <textarea
            className="notes-pad"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Write your weekly notes here..."
          />
        </div>
      </div>
      
      {isAddTaskModalOpen && (
        <AddTaskModal
          onAdd={onAddTodo}
          onClose={() => setIsAddTaskModalOpen(false)}
          initialDate={null}
        />
      )}
    </div>
  );
}

export default WeeklyReview; 