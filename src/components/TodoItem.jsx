import { useState } from 'react';
import { format, parseISO, addHours } from 'date-fns';

function TodoItem({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit,
  onAddToCalendar 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState(todo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTodo(todo);
  };

  const handleSave = () => {
    onEdit(editedTodo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTodo(todo);
  };

  const handleDragStart = (e) => {
    e.currentTarget.classList.add('dragging');
    
    // Create proper data structure for dragging
    const todoData = {
      text: todo.text,
      description: todo.description,
      priority: todo.priority,
      todoId: todo.id
    };
    
    // We need to ensure we're using the same structure the calendar expects
    e.dataTransfer.setData('text/plain', JSON.stringify({ todo: todoData }));
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="todo-edit-form">
          <input
            type="text"
            value={editedTodo.text}
            onChange={(e) => setEditedTodo({ ...editedTodo, text: e.target.value })}
            placeholder="Task title"
          />
          <textarea
            value={editedTodo.description || ''}
            onChange={(e) => setEditedTodo({ ...editedTodo, description: e.target.value })}
            placeholder="Description (optional)"
            rows="2"
          />
          <div className="form-row">
            <input
              type="datetime-local"
              value={editedTodo.scheduledFor || ''}
              onChange={(e) => setEditedTodo({ ...editedTodo, scheduledFor: e.target.value })}
            />
            <select
              value={editedTodo.priority || 'medium'}
              onChange={(e) => setEditedTodo({ ...editedTodo, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="edit-actions">
            <button onClick={handleCancel} className="button-secondary">
              Cancel
            </button>
            <button onClick={handleSave} className="button-primary">
              Save
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.priority || ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="todo-content">
        <div className="todo-text">{todo.text}</div>
        {todo.description && (
          <div className="todo-description">{todo.description}</div>
        )}
        <div className="todo-meta">
          {todo.scheduledFor && (
            <span className="todo-time">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              {format(parseISO(todo.scheduledFor), 'h:mm a')}
            </span>
          )}
          {todo.tag && (
            <span className={`todo-tag ${todo.tag}`}>{todo.tag}</span>
          )}
          {todo.priority && (
            <span className={`todo-priority ${todo.priority}`}>
              {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
            </span>
          )}
          {todo.addedToCalendar && (
            <span className="todo-calendar-indicator" title="Added to calendar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
              </svg>
            </span>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button 
          className="action-button"
          onClick={() => onToggle(todo.id)}
          title={todo.completed ? "Mark Incomplete" : "Mark Complete"}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        </button>
        <button 
          className="action-button"
          onClick={handleEdit}
          title="Edit"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        {todo.scheduledFor && !todo.addedToCalendar && (
          <button 
            className="action-button"
            onClick={() => onAddToCalendar(todo)}
            title="Add to Calendar"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
            </svg>
          </button>
        )}
        <button 
          className="action-button"
          onClick={() => onDelete(todo.id)}
          title="Delete"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TodoItem; 