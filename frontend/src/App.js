import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar    from './components/Navbar';
import Home      from './pages/Home';
import Products  from './pages/Products';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Cart      from './pages/Cart';
import Orders    from './pages/Orders';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ minHeight:'100vh', background:'#f9fafb', fontFamily:"'Inter', sans-serif" }}>
            <Navbar />
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart"     element={<Cart />} />
              <Route path="/orders"   element={<Orders />} />
            </Routes>
            <footer style={styles.footer}>
              <p>🐳 ShopWave · Dockerized · Kubernetes-Orchestrated · Azure AKS Ready</p>
              <p style={styles.footerSub}>Built for DevOps Training — Docker &amp; Kubernetes Lab Series</p>
            </footer>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = {
  footer:    { textAlign:'center', padding:'2rem', color:'#9ca3af', fontSize:'0.85rem', borderTop:'1px solid #e5e7eb', marginTop:'3rem' },
  footerSub: { marginTop:'0.25rem', fontSize:'0.8rem' },
};

export default App;
