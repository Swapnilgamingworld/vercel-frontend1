import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'medium', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className={`spinner spinner-${size}`} />
        <p>Loading...</p>
      </div>
    );
  }

  return <div className={`spinner spinner-${size}`} />;
}
