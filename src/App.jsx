import { useState, useEffect, useRef } from 'react'
import { format, parseISO, startOfToday, isAfter, isBefore, addHours, addDays, isToday, isTomorrow, isPast, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import TodoItem from './components/TodoItem'
import CalendarSidebar from './components/CalendarSidebar'
import AddTaskModal from './components/AddTaskModal'
import Sidebar from './components/Sidebar'
import DailyTaskList from './components/DailyTaskList'
import WeeklyReview from './components/WeeklyReview'

function App({ initialPage = 'planner' }) {
  const [todos, setTodos] = useState([])
  const [events, setEvents] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [dateOffset, setDateOffset] = useState(0)
  const [activePage, setActivePage] = useState(initialPage)
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Update activePage when route changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/app') {
      setActivePage('planner');
    } else if (path === '/daily-tasks') {
      setActivePage('daily-tasks');
    } else if (path === '/weekly-review') {
      setActivePage('weekly-review');
    }
  }, [location]);

  const visibleDates = [
    addDays(startOfToday(), dateOffset),
    addDays(startOfToday(), dateOffset + 1),
    addDays(startOfToday(), dateOffset + 2),
  ]

  // Handle navigation between pages
  const handleNavigate = (page) => {
    setActivePage(page);
    if (page === 'planner') {
      navigate('/app');
    } else {
      navigate(`/${page}`);
    }
  };

  const handleScrollLeft = () => {
    setDateOffset(prev => prev - 1)
  }

  const handleScrollRight = () => {
    setDateOffset(prev => prev + 1)
  }

  const handleAddTaskForDate = (date) => {
    setSelectedDate(date)
    setIsAddTaskModalOpen(true)
  }

  const getTasksForDate = (date) => {
    return todos.filter(todo => {
      if (!todo.scheduledFor) return false
      const todoDate = parseISO(todo.scheduledFor)
      return format(todoDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    })
  }

  const getUnscheduledAndPastDueTasks = () => {
    const now = new Date()
    return {
      pastDue: todos.filter(todo => 
        todo.scheduledFor && 
        isPast(parseISO(todo.scheduledFor)) && 
        !isToday(parseISO(todo.scheduledFor))
      ),
      unscheduled: todos.filter(todo => !todo.scheduledFor)
    }
  }

  // Check for notifications
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date()
      const newNotifications = [
        ...todos
          .filter(todo => 
            todo.scheduledFor && 
            !todo.completed && 
            isBefore(parseISO(todo.scheduledFor), now)
          )
          .map(todo => ({
            id: `todo-${todo.id}`,
            type: 'past-due',
            message: `Past due: ${todo.text}`,
            time: todo.scheduledFor
          })),
        ...events
          .filter(event => {
            const eventTime = parseISO(event.start)
            return isAfter(eventTime, now) && isBefore(eventTime, addHours(now, 1))
          })
          .map(event => ({
            id: `event-${event.id}`,
            type: 'upcoming',
            message: `Upcoming: ${event.title}`,
            time: event.start
          }))
      ]
      setNotifications(newNotifications)
    }

    checkNotifications()
    const interval = setInterval(checkNotifications, 60000)
    return () => clearInterval(interval)
  }, [todos, events])

  const addTodo = (task) => {
    if (task.title.trim()) {
      const newTodo = {
        id: Date.now(),
        text: task.title.trim(),
        description: task.description.trim(),
        scheduledFor: task.scheduledFor,
        priority: task.priority,
        completed: false,
        isOnCalendar: false
      };
      
      setTodos(prevTodos => [...prevTodos, newTodo]);
      
      // If the todo has a scheduled time, automatically add it to the calendar
      if (task.scheduledFor) {
        const newEvent = {
          id: `todo-event-${newTodo.id}`,
          text: newTodo.text,
          description: newTodo.description,
          priority: newTodo.priority,
          start: newTodo.scheduledFor,
          end: addHours(parseISO(newTodo.scheduledFor), 1).toISOString()
        };
        
        setEvents(prevEvents => [...prevEvents, newEvent]);
        
        // Mark the todo as added to calendar
        setTodos(prevTodos =>
          prevTodos.map(t =>
            t.id === newTodo.id ? { ...t, addedToCalendar: true } : t
          )
        );
      }
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const editTodo = (editedTodo) => {
    setTodos(todos.map(todo => 
      todo.id === editedTodo.id ? editedTodo : todo
    ));
    
    // If this todo is on the calendar, update the corresponding event
    if (editedTodo.addedToCalendar) {
      setEvents(prevEvents => 
        prevEvents.map(event => {
          if (event.id === `todo-event-${editedTodo.id}`) {
            return {
              ...event,
              text: editedTodo.text,
              description: editedTodo.description,
              priority: editedTodo.priority,
              start: editedTodo.scheduledFor,
              end: addHours(parseISO(editedTodo.scheduledFor), 1).toISOString()
            };
          }
          return event;
        })
      );
    }
    // If the todo now has a scheduled time but isn't on the calendar, add it
    else if (editedTodo.scheduledFor && !editedTodo.addedToCalendar) {
      const newEvent = {
        id: `todo-event-${editedTodo.id}`,
        text: editedTodo.text,
        description: editedTodo.description,
        priority: editedTodo.priority,
        start: editedTodo.scheduledFor,
        end: addHours(parseISO(editedTodo.scheduledFor), 1).toISOString()
      };
      
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      // Mark the todo as added to calendar
      setTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === editedTodo.id ? { ...t, addedToCalendar: true } : t
        )
      );
    }
  }

  const addToCalendar = (todo) => {
    if (todo.scheduledFor) {
      const newEvent = {
        id: `todo-event-${todo.id}`,
        text: todo.text,
        description: todo.description,
        priority: todo.priority,
        start: todo.scheduledFor,
        end: addHours(parseISO(todo.scheduledFor), 1).toISOString()
      };
      setEvents([...events, newEvent]);
      
      // Mark the todo as added to calendar
      setTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === todo.id ? { ...t, addedToCalendar: true } : t
        )
      );
    }
  };

  const handleCalendarDrop = (droppedData, dropTime) => {
    // Handle different data structures that might be dropped
    try {
      // If it's a new event from a todo
      if (!droppedData.id) {
        const newEvent = {
          id: `event-${Date.now()}`,
          text: droppedData.text,
          description: droppedData.description || '',
          priority: droppedData.priority || 'medium',
          start: droppedData.start || dropTime.toISOString(),
          end: droppedData.end || addHours(dropTime, 1).toISOString()
        };
        setEvents(prevEvents => [...prevEvents, newEvent]);

        // If this was dragged from a todo, mark it as added to calendar
        // and update its scheduledFor property to match the drop time
        if (droppedData.todoId) {
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === droppedData.todoId ? { 
                ...todo, 
                addedToCalendar: true,
                scheduledFor: dropTime.toISOString() 
              } : todo
            )
          );
        }
      } else {
        // If it's an existing event being moved
        const updatedEvent = {
          ...droppedData,
          start: dropTime.toISOString(),
          end: addHours(dropTime, 1).toISOString()
        };
        
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === droppedData.id ? updatedEvent : event
          )
        );
        
        // If this is a todo-event, also update the associated todo
        if (droppedData.id && droppedData.id.startsWith('todo-event-')) {
          const todoId = parseInt(droppedData.id.replace('todo-event-', ''));
          setTodos(prevTodos =>
            prevTodos.map(todo =>
              todo.id === todoId ? { 
                ...todo, 
                scheduledFor: dropTime.toISOString() 
              } : todo
            )
          );
        }
      }
    } catch (error) {
      console.error("Error in handleCalendarDrop:", error);
    }
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleEventRemove = (event) => {
    // Remove the event from the calendar
    setEvents(prevEvents => prevEvents.filter(e => e.id !== event.id));

    // If this was a todo event, update the todo's addedToCalendar flag
    if (event.id.startsWith('todo-event-')) {
      const todoId = parseInt(event.id.replace('todo-event-', ''));
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === todoId ? { ...todo, addedToCalendar: false } : todo
        )
      );
    }
  };

  const handleGoogleCalendarConnect = () => {
    // Mock function - would be replaced with actual Google Calendar API integration
    console.log('Connecting to Google Calendar...');
  };

  const handleDateColumnDrop = (e, date) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      
      // If it's a todo being dropped
      if (data.todo) {
        const todoData = data.todo;
        const todoId = todoData.todoId;
        
        // Create a new date at the start of the day
        const dropDate = startOfDay(date);
        
        // If the todo already has a time, preserve it
        let newScheduledFor = dropDate;
        
        setTodos(prevTodos => 
          prevTodos.map(todo => {
            if (todo.id === todoId) {
              // If the todo already has a time, preserve the time but update the date
              if (todo.scheduledFor) {
                const currentTime = parseISO(todo.scheduledFor);
                newScheduledFor = new Date(dropDate);
                newScheduledFor.setHours(currentTime.getHours(), currentTime.getMinutes());
              }
              
              return { 
                ...todo, 
                scheduledFor: newScheduledFor.toISOString() 
              };
            }
            return todo;
          })
        );
        
        // If this todo was on the calendar, update the calendar event too
        setEvents(prevEvents => 
          prevEvents.map(event => {
            if (event.id === `todo-event-${todoId}`) {
              const eventStart = new Date(newScheduledFor);
              const eventEnd = addHours(eventStart, 1);
              return {
                ...event,
                start: eventStart.toISOString(),
                end: eventEnd.toISOString()
              };
            }
            return event;
          })
        );
      }
    } catch (error) {
      console.error("Error in handleDateColumnDrop:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Render the active page content
  const renderPageContent = () => {
    switch (activePage) {
      case 'daily-tasks':
        return (
          <DailyTaskList 
            todos={todos}
            events={events}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onAddTodo={addTodo}
            onAddToCalendar={addToCalendar}
            onCalendarDrop={handleCalendarDrop}
            onEventUpdate={handleEventUpdate}
            onEventRemove={handleEventRemove}
            onGoogleCalendarConnect={handleGoogleCalendarConnect}
          />
        );
      case 'weekly-review':
        return (
          <WeeklyReview 
            todos={todos}
            events={events}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onAddTodo={addTodo}
            onAddToCalendar={addToCalendar}
            onCalendarDrop={handleCalendarDrop}
            onEventUpdate={handleEventUpdate}
            onEventRemove={handleEventRemove}
          />
        );
      case 'planner':
      default:
        return (
          <>
            <div className="tasks-container">
              <button 
                className="add-task-button main-add-button"
                onClick={() => {
                  setSelectedDate(null)
                  setIsAddTaskModalOpen(true)
                }}
              >
                <Plus size={20} />
                Add task
              </button>

              <div className="date-columns-container">
                <button 
                  className="scroll-button left"
                  onClick={handleScrollLeft}
                  aria-label="View previous days"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="date-columns" ref={scrollContainerRef}>
                  {visibleDates.map((date) => (
                    <div 
                      key={format(date, 'yyyy-MM-dd')} 
                      className="date-column"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDateColumnDrop(e, date)}
                    >
                      <div className="date-column-header">
                        <div className="date-info">
                          <h2>{format(date, 'EEEE')}</h2>
                          <span className="date">{format(date, 'MMM d')}</span>
                        </div>
                        <button
                          className="add-task-button column-add-button"
                          onClick={() => handleAddTaskForDate(date)}
                          title="Add task for this date"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="date-column-tasks">
                        {getTasksForDate(date).map(todo => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                            onAddToCalendar={addToCalendar}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  className="scroll-button right"
                  onClick={handleScrollRight}
                  aria-label="View next days"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="unscheduled-section">
                <h2>Unscheduled & Past Due</h2>
                <div className="unscheduled-content">
                  {getUnscheduledAndPastDueTasks().pastDue.length > 0 && (
                    <div className="past-due-tasks">
                      <h3>Past Due</h3>
                      <div className="task-cards-container">
                        {getUnscheduledAndPastDueTasks().pastDue.map(todo => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                            onEdit={editTodo}
                            onAddToCalendar={addToCalendar}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="unscheduled-tasks">
                    <h3>Unscheduled</h3>
                    <div className="task-cards-container">
                      {getUnscheduledAndPastDueTasks().unscheduled.map(todo => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onEdit={editTodo}
                          onAddToCalendar={addToCalendar}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CalendarSidebar
              events={events}
              onDrop={handleCalendarDrop}
              onEventUpdate={handleEventUpdate}
              onEventRemove={handleEventRemove}
              onGoogleCalendarConnect={handleGoogleCalendarConnect}
            />
          </>
        );
    }
  };

  return (
    <div className="todo-app">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      
      <main className={`main-content ${activePage}`}>
        {renderPageContent()}
        
        {isAddTaskModalOpen && activePage === 'planner' && (
          <AddTaskModal
            onAdd={addTodo}
            onClose={() => {
              setIsAddTaskModalOpen(false)
              setSelectedDate(null)
            }}
            initialDate={selectedDate}
          />
        )}
      </main>
    </div>
  )
}

export default App
