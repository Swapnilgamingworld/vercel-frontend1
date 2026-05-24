import { useState } from 'react';
import './Tooltip.css';

export default function Tooltip({ children, text, position = 'top' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="tooltip-wrapper">
      <div
        className="tooltip-trigger"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          <div className="tooltip-content">{text}</div>
        </div>
      )}
    </div>
  );
}
