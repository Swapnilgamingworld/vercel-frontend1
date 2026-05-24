import './StatsCard.css';

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  trendDirection = 'up',
  color = 'primary',
  subtitle,
}) {
  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-card-header">
        <div className="stats-card-icon">{icon}</div>
        <div className="stats-card-trend" data-direction={trendDirection}>
          {trendDirection === 'up' ? '▲' : '▼'} {trend}
        </div>
      </div>
      <h3 className="stats-card-title">{title}</h3>
      <div className="stats-card-value">{value}</div>
      {subtitle && <p className="stats-card-subtitle">{subtitle}</p>}
    </div>
  );
}
