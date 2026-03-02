import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function Cart() {
  const { items, removeFromCart, updateQty, clearCart, total } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing]   = useState(false);
  const [success, setSuccess]   = useState('');
  const [error,   setError]     = useState('');

  const placeOrder = async () => {
    if (!isAuthenticated) return navigate('/login');
    setPlacing(true);
    setError('');
    try {
      const payload = { items: items.map(i => ({ product_id: i.id, quantity: i.quantity })) };
      const { data } = await orderAPI.create(payload);
      clearCart();
      setSuccess(`✅ Order #${data.order.id.slice(0,8)} placed! Total: $${Number(data.order.total).toFixed(2)}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (success) return (
    <div style={styles.page}>
      <div style={styles.successBox}>
        <p style={{ fontSize:'1.1rem', fontWeight:600 }}>{success}</p>
        <Link to="/orders" style={styles.viewOrdersBtn}>View My Orders →</Link>
      </div>
    </div>
  );

  if (!items.length) return (
    <div style={styles.page}>
      <div style={styles.empty}>
        <p style={{ fontSize:'3rem' }}>🛒</p>
        <h2>Your cart is empty</h2>
        <Link to="/products" style={styles.shopBtn}>Continue Shopping →</Link>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Your Cart ({items.length} item{items.length !== 1 ? 's' : ''})</h1>
      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.layout}>
        {/* Items */}
        <div style={styles.items}>
          {items.map(item => (
            <div key={item.id} style={styles.row}>
              <img src={item.image_url} alt={item.name} style={styles.thumb}
                onError={e => { e.target.src='https://picsum.photos/80/80?grayscale'; }} />
              <div style={styles.info}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemPrice}>${Number(item.price).toFixed(2)} each</p>
              </div>
              <div style={styles.qtyControls}>
                <button onClick={() => updateQty(item.id, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                <span style={styles.qty}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} style={styles.qtyBtn}>+</button>
              </div>
              <p style={styles.lineTotal}>${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.id)} style={styles.removeBtn}>✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span style={{color:'#16a34a'}}>Free</span></div>
          <hr style={{ margin:'1rem 0', border:'none', borderTop:'1px solid #e5e7eb' }} />
          <div style={{...styles.summaryRow, fontWeight:700, fontSize:'1.1rem'}}><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button onClick={placeOrder} disabled={placing} style={styles.orderBtn}>
            {placing ? 'Placing order...' : isAuthenticated ? '🛍️ Place Order' : '🔐 Login to Order'}
          </button>
          <Link to="/products" style={styles.continueLink}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page:        { maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' },
  title:       { fontSize:'1.8rem', fontWeight:800, color:'#1f2937', marginBottom:'1.5rem' },
  layout:      { display:'grid', gridTemplateColumns:'1fr 320px', gap:'2rem', alignItems:'start' },
  items:       { display:'flex', flexDirection:'column', gap:'1rem' },
  row:         { background:'#fff', borderRadius:12, padding:'1rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  thumb:       { width:70, height:70, borderRadius:8, objectFit:'cover', flexShrink:0 },
  info:        { flex:1 },
  itemName:    { fontWeight:600, color:'#1f2937', marginBottom:4 },
  itemPrice:   { color:'#6b7280', fontSize:'0.85rem' },
  qtyControls: { display:'flex', alignItems:'center', gap:'0.5rem' },
  qtyBtn:      { width:28, height:28, border:'1px solid #e5e7eb', borderRadius:6, background:'#f9fafb', cursor:'pointer', fontWeight:700 },
  qty:         { fontWeight:700, minWidth:20, textAlign:'center' },
  lineTotal:   { fontWeight:700, minWidth:60, textAlign:'right' },
  removeBtn:   { background:'none', border:'none', color:'#9ca3af', cursor:'pointer', fontSize:'1rem', padding:'4px' },
  summary:     { background:'#fff', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', position:'sticky', top:80 },
  summaryTitle:{ fontWeight:700, fontSize:'1.1rem', marginBottom:'1rem', color:'#1f2937' },
  summaryRow:  { display:'flex', justifyContent:'space-between', marginBottom:'0.75rem', color:'#374151' },
  orderBtn:    { width:'100%', padding:'13px', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:'1rem', cursor:'pointer', marginTop:'1rem', marginBottom:'0.75rem' },
  continueLink:{ display:'block', textAlign:'center', color:'#6b7280', textDecoration:'none', fontSize:'0.9rem' },
  empty:       { textAlign:'center', padding:'5rem 2rem' },
  shopBtn:     { display:'inline-block', marginTop:'1rem', background:'#6366f1', color:'#fff', padding:'12px 28px', borderRadius:40, textDecoration:'none', fontWeight:700 },
  successBox:  { background:'#dcfce7', border:'1px solid #86efac', borderRadius:12, padding:'2rem', textAlign:'center', maxWidth:500, margin:'4rem auto' },
  viewOrdersBtn: { display:'inline-block', marginTop:'1rem', background:'#16a34a', color:'#fff', padding:'10px 24px', borderRadius:8, textDecoration:'none', fontWeight:600 },
  error:       { background:'#fee2e2', color:'#dc2626', padding:'0.75rem 1rem', borderRadius:8, marginBottom:'1rem' },
};
