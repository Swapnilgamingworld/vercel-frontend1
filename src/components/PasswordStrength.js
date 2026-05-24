import './PasswordStrength.css';

export default function PasswordStrength({ password }) {
  const getStrength = (pwd) => {
    if (!pwd) return { score: 0, level: 'none', label: 'No password' };
    
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, level: 'weak', label: 'Weak' };
    if (score <= 2) return { score: 2, level: 'fair', label: 'Fair' };
    if (score <= 4) return { score: 3, level: 'good', label: 'Good' };
    return { score: 4, level: 'strong', label: 'Strong' };
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength">
      <div className="strength-meter">
        <div className={`strength-bar strength-${strength.level}`} style={{ width: `${(strength.score / 4) * 100}%` }} />
      </div>
      <span className={`strength-label strength-${strength.level}`}>{strength.label}</span>
      {password && (
        <div className="strength-tips">
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: '8px' }}>
            ✓ Use {password.length >= 12 ? 'at least 12' : 'at least 8'} characters
            {/[a-z]/.test(password) ? ' ✓' : ' •'} lowercase letters
            {/[A-Z]/.test(password) ? ' ✓' : ' •'} UPPERCASE letters
            {/[0-9]/.test(password) ? ' ✓' : ' •'} numbers
            {/[^a-zA-Z0-9]/.test(password) ? ' ✓' : ' •'} special characters
          </p>
        </div>
      )}
    </div>
  );
}
