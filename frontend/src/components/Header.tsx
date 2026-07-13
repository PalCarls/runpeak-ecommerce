import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { cartCount, setSearchOpen } = useApp();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) => 'rp-nav-link' + (isActive ? ' rp-nav-link--active' : '');

  return (
    <nav className="rp-header">
      <div className="rp-logo" onClick={() => navigate('/')}>RUN<span>PEAK</span></div>
      <ul className="rp-nav">
        <li><NavLink to="/" className={navClass} end>Inicio</NavLink></li>
        <li><NavLink to="/catalogo" className={navClass}>Catálogo</NavLink></li>
        <li><NavLink to="/promociones" className={navClass}>Promociones</NavLink></li>
        <li><NavLink to="/" className="rp-nav-link">Nosotros</NavLink></li>
      </ul>
      <div className="rp-header-icons">
        <button className="rp-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar">&#128269;</button>
        <button className="rp-icon-btn" onClick={() => navigate('/favoritos')} aria-label="Favoritos">&#9825;</button>
        <button className="rp-icon-btn" onClick={() => navigate('/login')} aria-label="Cuenta">&#128100;</button>
        <button className="rp-icon-btn rp-icon-btn--cart" onClick={() => navigate('/carrito')} aria-label="Carrito">
          &#128722;
          {cartCount > 0 && <span className="rp-cart-badge">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}
