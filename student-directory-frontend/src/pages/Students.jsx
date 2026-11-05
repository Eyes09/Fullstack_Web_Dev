import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch students');
        }

        if (Array.isArray(data)) {
          setStudents(data);
        } else if (Array.isArray(data.students)) {
          setStudents(data.students);
        } else if (Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudents();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'ST';
  };

  // Avatar gradient generator based on student name length
  const getAvatarGradient = (name = '') => {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      'linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)',
      'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)',
      'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    ];
    return gradients[name.length % gradients.length];
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.loadingPulse}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.centerContainer}>
        <div style={styles.errorCard}>
          <div style={styles.errorIcon}>⚠️</div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>Failed to load directory</h3>
          <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageBackground}>
      <div style={styles.container}>
        {/* Navigation & Header */}
        <header style={styles.header}>
          <div style={styles.brandGroup}>
            <div style={styles.logoBadge}>🎓</div>
            <div>
              <h1 style={styles.title}>Student Directory</h1>
              <p style={styles.subtitle}>
                {students.length} {students.length === 1 ? 'student enrolled' : 'students enrolled'}
              </p>
            </div>
          </div>

          <div style={styles.userActions}>
            {user?.email && (
              <span style={styles.userBadge}>
                👤 {user.name || user.email}
              </span>
            )}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sign Out
            </button>
          </div>
        </header>

        {/* Search & Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Directory Grid */}
        {filteredStudents.length === 0 ? (
          <div style={styles.emptyCard}>
            <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</span>
            <h3 style={{ margin: '0.5rem 0 0.25rem 0', color: '#334155' }}>No students found</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
              {searchTerm ? 'Try adjusting your search terms.' : 'No records exist in the database.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredStudents.map((student) => (
              <div
                key={student._id || student.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px -5px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div
                  style={{
                    ...styles.avatar,
                    background: getAvatarGradient(student.name || ''),
                  }}
                >
                  {getInitials(student.name)}
                </div>

                <div style={styles.cardInfo}>
                  <h3 style={styles.studentName}>{student.name || 'Unnamed Student'}</h3>
                  <p style={styles.studentEmail}>{student.email || 'No email provided'}</p>
                  <span style={styles.statusBadge}>Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageBackground: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    color: '#0f172a',
    padding: '2.5rem 1.5rem',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '1.25rem 1.75rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoBadge: {
    fontSize: '1.75rem',
    backgroundColor: '#e0e7ff',
    width: '48px',
    height: '48px',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '800',
    margin: 0,
    color: '#1e293b',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '0.15rem 0 0 0',
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: '500',
  },
  userActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userBadge: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f8fafc',
    padding: '0.4rem 0.8rem',
    borderRadius: '2rem',
    border: '1px solid #e2e8f0',
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    padding: '0.55rem 1.25rem',
    borderRadius: '0.6rem',
    fontWeight: '600',
    fontSize: '0.875rem',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)',
    transition: 'all 0.2s ease',
  },
  toolbar: {
    marginBottom: '1.5rem',
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '1.2rem',
    fontSize: '1rem',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '0.85rem 1rem 0.85rem 2.8rem',
    borderRadius: '0.8rem',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    fontSize: '0.95rem',
    color: '#1e293b',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.25rem',
    border: '1px solid #f1f5f9',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    alignItems: 'center',
    gap: '1.1rem',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '0.85rem',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '1.05rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  cardInfo: {
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  studentName: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#0f172a',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  studentEmail: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: '0.35rem',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#166534',
    backgroundColor: '#dcfce7',
    padding: '0.15rem 0.5rem',
    borderRadius: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    padding: '3.5rem 2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  centerContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    fontFamily: 'sans-serif',
  },
  loadingPulse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    maxWidth: '400px',
  },
  errorIcon: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
};