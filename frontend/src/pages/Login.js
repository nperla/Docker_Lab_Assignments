import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Sign In</h2>
        <p style={styles.sub}>
          Demo: <code>demo@shopwave.io</code> / <code>demo1234</code>
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            style={styles.input}
            placeholder="you@example.com"
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
            style={styles.input}
            placeholder="••••••••"
          />

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.footerLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:      { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'#f9fafb' },
  card:      { background:'#fff', borderRadius:16, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(0,0,0,0.08)' },
  title:     { textAlign:'center', marginBottom:'0.5rem', fontSize:'1.8rem', fontWeight:800, color:'#1f2937' },
  sub:       { textAlign:'center', color:'#6b7280', marginBottom:'1.5rem', fontSize:'0.9rem' },
  label:     { display:'block', marginBottom:'0.4rem', fontWeight:600, color:'#374151', fontSize:'0.9rem' },
  input:     { width:'100%', padding:'11px 14px', border:'1px solid #e5e7eb', borderRadius:8, marginBottom:'1rem', fontSize:'1rem', boxSizing:'border-box', outline:'none' },
  btn:       { width:'100%', padding:'12px', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'1rem', cursor:'pointer', marginTop:'0.5rem' },
  error:     { background:'#fee2e2', color:'#dc2626', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem', fontSize:'0.9rem' },
  footer:    { textAlign:'center', marginTop:'1.5rem', color:'#6b7280', fontSize:'0.9rem' },
  footerLink:{ color:'#6366f1', fontWeight:600, textDecoration:'none' },
};
