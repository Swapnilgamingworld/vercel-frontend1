import './Badge.css';

export default function Badge({ children, variant = 'primary', size = 'medium' }) {
  return <span className={`badge badge-${variant} badge-${size}`}>{children}</span>;
}
