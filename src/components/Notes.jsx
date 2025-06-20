import { useState, useEffect } from 'react';

function Notes({ loggedInUser }) {
  const [notes, setNotes] = useState('');
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    if (loggedInUser) {
      const savedNotes = localStorage.getItem(`notes:${loggedInUser}`);
      if (savedNotes) {
        setNotes(savedNotes);
      }
    }
  }, [loggedInUser]);
  
  // Save notes to localStorage when they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    
    if (loggedInUser) {
      localStorage.setItem(`notes:${loggedInUser}`, newNotes);
    }
  };
  
  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h2 className="notes-title">Notes</h2>
      </div>
      
      <div className="notes-content">
        <textarea
          className="notes-textarea"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here..."
        />
      </div>
      
      {!loggedInUser && (
        <div className="notes-preview-notice">
          <p>Preview Mode: Notes won't save</p>
        </div>
      )}
    </div>
  );
}

export default Notes; 