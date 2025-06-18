import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal; 