import { Link } from 'react-router-dom';
import './QuickActions.css';

export default function QuickActions({ actions }) {
  return (
    <div className="quick-actions">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.to}
          className="quick-action-btn"
          title={action.label}
        >
          <span className="quick-action-icon">{action.icon}</span>
          <span className="quick-action-label">{action.label}</span>
        </Link>
      ))}
    </div>
  );
}
