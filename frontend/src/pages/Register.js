import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,  setForm]    = useState({ name:'', email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>✨ Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label:'Full Name',    key:'name',     type:'text',     placeholder:'Jane Smith' },
            { label:'Email',        key:'email',    type:'email',    placeholder:'jane@example.com' },
            { label:'Password',     key:'password', type:'password', placeholder:'Min 8 characters' },
          ].map(f => (
            <div key={f.key}>
              <label style={styles.label}>{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required
                style={styles.input}
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.footerLink}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:      { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:'#f9fafb' },
  card:      { background:'#fff', borderRadius:16, padding:'2.5rem', width:'100%', maxWidth:420, boxShadow:'0 4px 24px rgba(0,0,0,0.08)' },
  title:     { textAlign:'center', marginBottom:'1.5rem', fontSize:'1.8rem', fontWeight:800, color:'#1f2937' },
  label:     { display:'block', marginBottom:'0.4rem', fontWeight:600, color:'#374151', fontSize:'0.9rem' },
  input:     { width:'100%', padding:'11px 14px', border:'1px solid #e5e7eb', borderRadius:8, marginBottom:'1rem', fontSize:'1rem', boxSizing:'border-box' },
  btn:       { width:'100%', padding:'12px', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'1rem', cursor:'pointer', marginTop:'0.5rem' },
  error:     { background:'#fee2e2', color:'#dc2626', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem', fontSize:'0.9rem' },
  footer:    { textAlign:'center', marginTop:'1.5rem', color:'#6b7280', fontSize:'0.9rem' },
  footerLink:{ color:'#6366f1', fontWeight:600, textDecoration:'none' },
};
