import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import Promotions from './pages/Promotions';
import Favorites from './pages/Favorites';
import Confirmation from './pages/Confirmation';
import Admin from './pages/Admin';
import './styles/app.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/seguimiento" element={<Tracking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/promociones" element={<Promotions />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/confirmacion" element={<Confirmation />} />
          </Route>
          {/* Admin has its own sidebar layout, no header/footer */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
