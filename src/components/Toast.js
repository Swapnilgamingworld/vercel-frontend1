import { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{icons[type]}</span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
