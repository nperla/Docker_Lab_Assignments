import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Welcome to <span style={{color:'#a5b4fc'}}>ShopWave</span> 🛍️</h1>
        <p style={styles.heroSub}>A cloud-native e-commerce app running on Docker & Kubernetes</p>
        <Link to="/products" style={styles.heroCta}>Browse Products →</Link>
      </div>

      {/* Features */}
      <div style={styles.features}>
        {[
          { icon:'🐳', title:'Docker Ready',       desc:'Multi-stage builds, non-root users, minimal Alpine images' },
          { icon:'☸️', title:'Kubernetes Native',  desc:'Deployments, StatefulSets, HPA, Ingress with TLS' },
          { icon:'☁️', title:'Azure AKS',          desc:'ACR integration, Azure Monitor, cluster autoscaler' },
          { icon:'🔄', title:'CI/CD Automated',    desc:'GitHub Actions pipeline with zero-downtime rolling updates' },
        ].map(f => (
          <div key={f.title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech stack badge row */}
      <div style={styles.badges}>
        {['Node.js 18','React 18','PostgreSQL 15','Docker 24','Kubernetes 1.28','Helm 3','NGINX','cert-manager'].map(t => (
          <span key={t} style={styles.badge}>{t}</span>
        ))}
      </div>
    </div>
  );
}

const styles = {
  hero:         { background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', color:'#fff', textAlign:'center', padding:'5rem 2rem' },
  heroTitle:    { fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:800, margin:'0 0 1rem', letterSpacing:'-1px' },
  heroSub:      { fontSize:'1.2rem', opacity:0.85, margin:'0 0 2rem', maxWidth:600, marginLeft:'auto', marginRight:'auto' },
  heroCta:      { display:'inline-block', background:'#fff', color:'#6366f1', padding:'14px 32px', borderRadius:40, fontWeight:700, textDecoration:'none', fontSize:'1.1rem', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', transition:'transform 0.2s' },
  features:     { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem', padding:'4rem 2rem', maxWidth:1200, margin:'0 auto' },
  featureCard:  { background:'#fff', borderRadius:16, padding:'2rem', textAlign:'center', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6' },
  featureIcon:  { fontSize:'2.5rem', marginBottom:'1rem' },
  featureTitle: { fontWeight:700, fontSize:'1.1rem', marginBottom:'0.5rem', color:'#1f2937' },
  featureDesc:  { color:'#6b7280', lineHeight:1.6, fontSize:'0.9rem' },
  badges:       { display:'flex', flexWrap:'wrap', justifyContent:'center', gap:'0.75rem', padding:'0 2rem 4rem', maxWidth:1200, margin:'0 auto' },
  badge:        { background:'#ede9fe', color:'#5b21b6', borderRadius:20, padding:'6px 16px', fontSize:'0.85rem', fontWeight:600 },
};
