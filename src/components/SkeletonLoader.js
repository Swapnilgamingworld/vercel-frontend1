import './SkeletonLoader.css';

export default function SkeletonLoader({ count = 3, type = 'card' }) {
  const skeletons = Array(count).fill(0);

  if (type === 'table-row') {
    return (
      <>
        {skeletons.map((_, i) => (
          <tr key={i} className="skeleton-table-row">
            <td><div className="skeleton-text skeleton-short" /></td>
            <td><div className="skeleton-text skeleton-medium" /></td>
            <td><div className="skeleton-text skeleton-short" /></td>
            <td><div className="skeleton-text skeleton-medium" /></td>
            <td><div className="skeleton-button" /></td>
          </tr>
        ))}
      </>
    );
  }

  if (type === 'card') {
    return (
      <div className="skeleton-grid">
        {skeletons.map((_, i) => (
          <div key={i} className="skeleton-card">
            <div className="skeleton-line skeleton-short" style={{ marginBottom: '12px' }} />
            <div className="skeleton-line skeleton-long" style={{ marginBottom: '12px' }} />
            <div className="skeleton-line skeleton-medium" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className="skeleton-form">
        {skeletons.map((_, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div className="skeleton-line skeleton-short" style={{ marginBottom: '8px' }} />
            <div className="skeleton-line skeleton-long" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-grid">
      {skeletons.map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-avatar" />
          <div className="skeleton-line skeleton-short" style={{ marginBottom: '12px' }} />
          <div className="skeleton-line skeleton-medium" />
        </div>
      ))}
    </div>
  );
}
