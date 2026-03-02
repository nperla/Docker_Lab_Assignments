import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { count } = useCart();
  const navigate  = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>🛍️ ShopWave</Link>

        {/* Links */}
        <div style={styles.links}>
          <Link to="/products" style={styles.link}>Products</Link>

          {isAuthenticated ? (
            <>
              <Link to="/orders" style={styles.link}>My Orders</Link>
              <span style={styles.userName}>👤 {user?.name}</span>
              <button onClick={handleLogout} style={styles.btn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    style={styles.link}>Login</Link>
              <Link to="/register" style={{...styles.btn, textDecoration:'none', display:'inline-block'}}>Sign Up</Link>
            </>
          )}

          {/* Cart badge */}
          <Link to="/cart" style={styles.cartLink}>
            🛒 <span style={styles.badge}>{count}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav:      { background:'#6366f1', color:'#fff', padding:'0 1.5rem', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.15)' },
  inner:    { maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 },
  logo:     { color:'#fff', textDecoration:'none', fontWeight:700, fontSize:'1.3rem', letterSpacing:'-0.5px' },
  links:    { display:'flex', alignItems:'center', gap:'1.2rem' },
  link:     { color:'rgba(255,255,255,0.9)', textDecoration:'none', fontSize:'0.95rem', fontWeight:500 },
  userName: { color:'rgba(255,255,255,0.8)', fontSize:'0.9rem' },
  btn:      { background:'rgba(255,255,255,0.2)', color:'#fff', border:'1px solid rgba(255,255,255,0.4)', borderRadius:6, padding:'6px 14px', cursor:'pointer', fontSize:'0.9rem', fontWeight:500 },
  cartLink: { color:'#fff', textDecoration:'none', fontSize:'1.2rem', position:'relative' },
  badge:    { background:'#f43f5e', borderRadius:'50%', padding:'2px 7px', fontSize:'0.75rem', fontWeight:700, marginLeft:2 },
};
