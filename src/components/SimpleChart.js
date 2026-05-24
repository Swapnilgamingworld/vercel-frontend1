import './SimpleChart.css';

export default function SimpleChart({ data, type = 'bar', title }) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const chartHeight = 200;
  const barHeight = (value) => (value / maxValue) * chartHeight;

  if (type === 'bar') {
    return (
      <div className="simple-chart">
        {title && <h3 className="chart-title">{title}</h3>}
        <div className="bar-chart">
          {data.map((item, i) => (
            <div key={i} className="bar-container">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{ height: `${barHeight(item.value)}px` }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
              <label className="bar-label">{item.label}</label>
              <span className="bar-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'pie') {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const colors = ['#4f46e5', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];
    let currentAngle = 0;

    return (
      <div className="simple-chart">
        {title && <h3 className="chart-title">{title}</h3>}
        <div className="pie-chart-container">
          <svg viewBox="0 0 100 100" className="pie-chart">
            {data.map((item, i) => {
              const sliceAngle = (item.value / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;

              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);

              const largeArc = sliceAngle > 180 ? 1 : 0;
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ');

              currentAngle = endAngle;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={colors[i % colors.length]}
                  stroke="var(--panel)"
                  strokeWidth="2"
                  opacity="0.8"
                  style={{ transition: 'opacity 200ms ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                />
              );
            })}
          </svg>
          <div className="pie-legend">
            {data.map((item, i) => (
              <div key={i} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                <span className="legend-label">{item.label}</span>
                <span className="legend-value">{((item.value / total) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'line') {
    const width = 400;
    const height = 200;
    const padding = 20;
    const maxVal = Math.max(...data.map((d) => d.value));
    const xStep = (width - padding * 2) / (data.length - 1 || 1);
    const yScale = (height - padding * 2) / maxVal;

    const points = data
      .map((d, i) => ({
        x: padding + i * xStep,
        y: height - padding - d.value * yScale,
      }))
      .map((p) => `${p.x},${p.y}`)
      .join(' ');

    return (
      <div className="simple-chart">
        {title && <h3 className="chart-title">{title}</h3>}
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart">
          <polyline points={points} fill="none" stroke="var(--primary)" strokeWidth="2" />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={padding + i * xStep}
              cy={height - padding - d.value * yScale}
              r="4"
              fill="var(--primary)"
              className="chart-dot"
            />
          ))}
        </svg>
      </div>
    );
  }

  return <div>Unsupported chart type</div>;
}
