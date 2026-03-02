import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={product.image_url} alt={product.name} style={styles.img}
          onError={e => { e.target.src = 'https://picsum.photos/400/300?grayscale'; }} />
        {product.stock === 0 && <div style={styles.outOfStock}>Out of Stock</div>}
      </div>

      <div style={styles.body}>
        <span style={styles.category}>{product.category_name || 'General'}</span>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>

        <div style={styles.footer}>
          <span style={styles.price}>${Number(product.price).toFixed(2)}</span>
          <span style={styles.stock}>
            {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          style={{ ...styles.addBtn, ...(product.stock === 0 ? styles.disabled : {}) }}
        >
          {product.stock > 0 ? '+ Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card:       { background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 2px 12px rgba(0,0,0,0.08)', transition:'transform 0.2s, box-shadow 0.2s', display:'flex', flexDirection:'column' },
  imgWrap:    { position:'relative', paddingTop:'65%', overflow:'hidden', background:'#f3f4f6' },
  img:        { position:'absolute', top:0, left:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s' },
  outOfStock: { position:'absolute', top:10, right:10, background:'#ef4444', color:'#fff', padding:'3px 10px', borderRadius:20, fontSize:'0.75rem', fontWeight:600 },
  body:       { padding:'1rem', display:'flex', flexDirection:'column', flex:1 },
  category:   { color:'#6366f1', fontSize:'0.75rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 },
  name:       { margin:'6px 0 8px', fontSize:'1rem', fontWeight:600, color:'#1f2937', lineHeight:1.4 },
  desc:       { color:'#6b7280', fontSize:'0.85rem', lineHeight:1.5, flex:1, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  footer:     { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 },
  price:      { fontSize:'1.2rem', fontWeight:700, color:'#1f2937' },
  stock:      { fontSize:'0.8rem', color:'#9ca3af' },
  addBtn:     { width:'100%', padding:'10px', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:'0.9rem', transition:'background 0.2s' },
  disabled:   { background:'#d1d5db', cursor:'not-allowed' },
};
