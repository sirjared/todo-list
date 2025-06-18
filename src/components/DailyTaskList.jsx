import { useState } from 'react';
import { format, parseISO, isToday, addHours } from 'date-fns';
import { Plus } from 'lucide-react';
import TodoItem from './TodoItem';
import CalendarSidebar from './CalendarSidebar';
import AddTaskModal from './AddTaskModal';

function DailyTaskList({ 
  todos, 
  events, 
  onToggleTodo, 
  onDeleteTodo, 
  onEditTodo, 
  onAddTodo, 
  onAddToCalendar,
  onCalendarDrop,
  onEventUpdate,
  onEventRemove,
  onGoogleCalendarConnect
}) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [notes, setNotes] = useState(localStorage.getItem('dailyNotes') || '');

  // Save notes to localStorage when they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem('dailyNotes', newNotes);
  };

  // Get today's tasks
  const todayTasks = todos.filter(todo => {
    if (!todo.scheduledFor) return false;
    return isToday(parseISO(todo.scheduledFor));
  });

  return (
    <div className="daily-task-list">
      <div className="daily-task-content">
        <div className="daily-task-header">
          <h1>Today's Tasks</h1>
          <button 
            className="add-task-button main-add-button"
            onClick={() => setIsAddTaskModalOpen(true)}
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        <div className="daily-task-sections">
          <div className="tasks-section">
            <h2>To-Do List</h2>
            <div className="tasks-list">
              {todayTasks.length > 0 ? (
                todayTasks.map(todo => (
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
                  <p>No tasks for today. Add a new task to get started!</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="notes-section">
            <h2>Notes</h2>
            <textarea
              className="notes-pad"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Write your notes for today here..."
            />
          </div>
        </div>
      </div>

      <div className="daily-calendar-sidebar">
        <CalendarSidebar
          events={events}
          onDrop={onCalendarDrop}
          onEventUpdate={onEventUpdate}
          onEventRemove={onEventRemove}
          onGoogleCalendarConnect={onGoogleCalendarConnect}
          isAlwaysOpen={true}
        />
      </div>

      {isAddTaskModalOpen && (
        <AddTaskModal
          onAdd={(task) => {
            // Set today's date if no date is provided
            const taskWithDate = task.scheduledFor 
              ? task 
              : { ...task, scheduledFor: new Date().toISOString() };
            
            onAddTodo(taskWithDate);
            setIsAddTaskModalOpen(false);
          }}
          onClose={() => setIsAddTaskModalOpen(false)}
          initialDate={new Date()}
        />
      )}
    </div>
  );
}

export default DailyTaskList; 