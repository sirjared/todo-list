import { useState, useEffect } from 'react';
import { format, parseISO, addMinutes } from 'date-fns';
import Modal from './Modal';

function EditEventModal({ event, onSave, onClose }) {
  const [editedEvent, setEditedEvent] = useState({
    ...event,
    end: event.end || addMinutes(new Date(event.start), 30).toISOString()
  });

  useEffect(() => {
    setEditedEvent({
      ...event,
      end: event.end || addMinutes(new Date(event.start), 30).toISOString()
    });
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedEvent);
  };

  const formatTimeForInput = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm');
    } catch (error) {
      console.error("Error formatting time:", error);
      return "00:00";
    }
  };

  const updateEventTime = (field, timeString) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      const newDate = new Date(editedEvent[field]);
      newDate.setHours(hours, minutes);
      
      // If end time is earlier than start time, adjust to be at least 15 minutes later
      if (field === 'end' && newDate <= new Date(editedEvent.start)) {
        newDate.setTime(new Date(editedEvent.start).getTime() + 15 * 60000);
      }
      
      setEditedEvent({ ...editedEvent, [field]: newDate.toISOString() });
    } catch (error) {
      console.error("Error updating time:", error);
    }
  };

  const calculateDuration = () => {
    try {
      const startTime = new Date(editedEvent.start);
      const endTime = new Date(editedEvent.end);
      const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
      
      if (durationMinutes < 60) {
        return `${durationMinutes} minutes`;
      } else {
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} min` : ''}`;
      }
    } catch (error) {
      return "Unknown duration";
    }
  };

  if (!event) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit} className="edit-form">
          <h2>Edit Event</h2>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={editedEvent.text}
              onChange={(e) => setEditedEvent({ ...editedEvent, text: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedEvent.description || ''}
              onChange={(e) => setEditedEvent({ ...editedEvent, description: e.target.value })}
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formatTimeForInput(editedEvent.start)}
                onChange={(e) => updateEventTime('start', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                value={formatTimeForInput(editedEvent.end)}
                onChange={(e) => updateEventTime('end', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Duration</label>
            <div className="duration-display">{calculateDuration()}</div>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              value={editedEvent.priority || 'medium'}
              onChange={(e) => setEditedEvent({ ...editedEvent, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Cancel
            </button>
            <button type="submit" className="button-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal; 