import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const STATUS_COLORS = {
  pending:    { bg:'#fef9c3', color:'#854d0e' },
  processing: { bg:'#dbeafe', color:'#1e40af' },
  shipped:    { bg:'#ede9fe', color:'#5b21b6' },
  delivered:  { bg:'#dcfce7', color:'#166534' },
  cancelled:  { bg:'#fee2e2', color:'#991b1b' },
};

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    orderAPI.getAll()
      .then(r => setOrders(r.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return (
    <div style={styles.center}>
      <h2>Please <Link to="/login">log in</Link> to view your orders.</h2>
    </div>
  );

  if (loading) return <div style={styles.center}>⏳ Loading orders...</div>;
  if (error)   return <div style={{ ...styles.center, color:'#dc2626' }}>{error}</div>;

  if (!orders.length) return (
    <div style={styles.center}>
      <p style={{ fontSize:'2.5rem' }}>📦</p>
      <h2>No orders yet!</h2>
      <Link to="/products" style={styles.shopBtn}>Start Shopping →</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📦 My Orders</h1>
      <div style={styles.list}>
        {orders.map(order => {
          const sc = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
          return (
            <div key={order.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <span style={styles.orderId}>Order #{order.id.slice(0,8).toUpperCase()}</span>
                  <span style={{ ...styles.statusBadge, background:sc.bg, color:sc.color }}>
                    {order.status}
                  </span>
                </div>
                <div style={styles.orderMeta}>
                  <span style={styles.total}>${Number(order.total).toFixed(2)}</span>
                  <span style={styles.date}>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={styles.itemsList}>
                {(order.items || []).map((item, i) => (
                  <div key={i} style={styles.itemRow}>
                    <span>{item.product_name}</span>
                    <span style={styles.itemMeta}>x{item.quantity} · ${Number(item.unit_price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page:        { maxWidth:800, margin:'0 auto', padding:'2rem 1.5rem' },
  title:       { fontSize:'1.8rem', fontWeight:800, color:'#1f2937', marginBottom:'1.5rem' },
  list:        { display:'flex', flexDirection:'column', gap:'1rem' },
  card:        { background:'#fff', borderRadius:12, padding:'1.5rem', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader:  { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' },
  orderId:     { fontWeight:700, color:'#1f2937', fontSize:'1rem', marginRight:'0.75rem' },
  statusBadge: { padding:'3px 12px', borderRadius:20, fontSize:'0.8rem', fontWeight:600, textTransform:'capitalize' },
  orderMeta:   { textAlign:'right' },
  total:       { display:'block', fontWeight:700, fontSize:'1.1rem', color:'#1f2937' },
  date:        { color:'#9ca3af', fontSize:'0.85rem' },
  itemsList:   { borderTop:'1px solid #f3f4f6', paddingTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.5rem' },
  itemRow:     { display:'flex', justifyContent:'space-between', color:'#374151', fontSize:'0.9rem' },
  itemMeta:    { color:'#9ca3af' },
  center:      { textAlign:'center', padding:'5rem 2rem' },
  shopBtn:     { display:'inline-block', marginTop:'1rem', background:'#6366f1', color:'#fff', padding:'12px 28px', borderRadius:40, textDecoration:'none', fontWeight:700 },
};
