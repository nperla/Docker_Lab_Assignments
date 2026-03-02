import { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState('');

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search)   params.search   = search;
    if (category) params.category = category;

    productAPI.getAll(params)
      .then(r => setProducts(r.data.products))
      .catch(() => setError('Failed to load products. Is the API running?'))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>All Products</h1>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.input}
          />
          <select value={category} onChange={e => setCategory(e.target.value)} style={styles.select}>
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.slug} value={c.slug}>{c.name} ({c.product_count})</option>
            ))}
          </select>
          {(search || category) && (
            <button onClick={() => { setSearch(''); setCategory(''); }} style={styles.clearBtn}>
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {loading && <div style={styles.center}>⏳ Loading products...</div>}
      {error   && <div style={styles.error}>{error}</div>}

      {!loading && !error && (
        products.length === 0
          ? <div style={styles.center}>😢 No products found.</div>
          : (
            <div style={styles.grid}>
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )
      )}
    </div>
  );
}

const styles = {
  page:     { maxWidth:1200, margin:'0 auto', padding:'2rem 1.5rem' },
  header:   { marginBottom:'2rem' },
  title:    { fontSize:'2rem', fontWeight:800, color:'#1f2937', marginBottom:'1.5rem' },
  filters:  { display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'center' },
  input:    { flex:1, minWidth:220, padding:'10px 14px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:'0.95rem', outline:'none' },
  select:   { padding:'10px 14px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:'0.95rem', background:'#fff', cursor:'pointer' },
  clearBtn: { padding:'10px 16px', background:'#f3f4f6', border:'1px solid #e5e7eb', borderRadius:8, cursor:'pointer', fontSize:'0.9rem', fontWeight:500 },
  grid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.5rem' },
  center:   { textAlign:'center', padding:'4rem', color:'#6b7280', fontSize:'1.1rem' },
  error:    { background:'#fee2e2', color:'#dc2626', padding:'1rem 1.5rem', borderRadius:10, marginBottom:'1rem', fontWeight:500 },
};
