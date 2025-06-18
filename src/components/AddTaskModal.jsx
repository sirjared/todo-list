import { useState } from 'react';
import { format } from 'date-fns';
import Modal from './Modal';

const AddTaskModal = ({ onAdd, onClose, initialDate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [scheduledFor, setScheduledFor] = useState(
    initialDate ? format(initialDate, 'yyyy-MM-dd') : ''
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      title,
      description,
      priority,
      scheduledFor: scheduledFor || null,
      completed: false,
      isOnCalendar: false
    });
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <form onSubmit={handleSubmit} className="add-task-form">
        <h2>Add New Task</h2>
        
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="scheduledFor">Schedule for</label>
          <input
            type="date"
            id="scheduledFor"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} className="button secondary">
            Cancel
          </button>
          <button type="submit" className="button primary">
            Add Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal; 