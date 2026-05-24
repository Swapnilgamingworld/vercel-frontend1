import './AnimatedBackground.css';

export default function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <div className="animated-bg-gradient gradient-1" />
      <div className="animated-bg-gradient gradient-2" />
      <div className="animated-bg-gradient gradient-3" />
      
      <div className="floating-particle particle-1" />
      <div className="floating-particle particle-2" />
      <div className="floating-particle particle-3" />
      <div className="floating-particle particle-4" />
      <div className="floating-particle particle-5" />
      
      <svg className="animated-waves" preserveAspectRatio="none" viewBox="0 0 1200 120">
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="url(#wave-gradient)"
          opacity="0.1"
        />
        <path
          d="M0,60 Q300,30 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="url(#wave-gradient)"
          opacity="0.05"
        />
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--info)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
