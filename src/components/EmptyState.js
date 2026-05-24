import './EmptyState.css';

export default function EmptyState({ icon = '📭', title, message, action = null }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{message}</p>
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
