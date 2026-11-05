import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/students');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageBackground}>
      <div style={styles.card}>
        <div style={styles.headerGroup}>
          <img src="/A8KQzu.gif" alt="Logo" style={styles.logoImage} />
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to access the Student Directory</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '1.25rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
    width: '100%',
    maxWidth: '420px',
    border: '1px solid #f1f5f9',
  },
  headerGroup: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  logoImage: {
    width: '400px',  
    height: '100px',   
    objectFit: 'contain',
    borderRadius: '0.75rem',
    margin: '0 auto 1rem auto',
    display: 'block',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '0.35rem',
    marginBottom: 0,
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '0.75rem 1rem',
    borderRadius: '0.7rem',
    fontSize: '0.875rem',
    marginBottom: '1.25rem',
    border: '1px solid #fecaca',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#334155',
  },
  input: {
    padding: '0.85rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #cbd5e1',
    fontSize: '0.95rem',
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  button: {
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '0.75rem',
    fontWeight: '700',
    fontSize: '0.95rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    transition: 'background-color 0.2s ease',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: '1.5rem',
    marginBottom: 0,
  },
  link: {
    color: '#6366f1',
    fontWeight: '700',
    textDecoration: 'none',
  },
};