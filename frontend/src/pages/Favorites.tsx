import { useNavigate } from 'react-router-dom';
import { money } from '../data/products';
import { useApp } from '../context/AppContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { favorites, removeFavorite, addToCart, products: catalog } = useApp();
  const products = catalog.filter(p => favorites.includes(p.id));

  return (
    <div>
      <div style={{ padding: '36px 48px 8px' }}>
        <h1 className="rp-h2" style={{ margin: 0 }}>MIS FAVORITOS</h1>
      </div>

      {products.length > 0 ? (
        <div style={{ padding: '20px 48px 72px' }} className="rp-grid-4">
          {products.map(p => (
            <div key={p.id} className="rp-card">
              <div className="rp-card-img" style={{ backgroundImage: `url(${p.img})` }}>
                <button className="rp-card-fav" onClick={() => removeFavorite(p.id)}>&#10005;</button>
              </div>
              <div className="rp-card-body">
                <div className="rp-card-category">{p.category}</div>
                <div className="rp-card-name">{p.name}</div>
                <div className="rp-card-price" style={{ marginBottom: 14 }}>{money(p.price)}</div>
                <button
                  className="rp-btn-primary"
                  style={{ width: '100%', padding: 12, fontSize: 11 }}
                  onClick={() => { addToCart(p.id, p.name, p.price, p.img, p.sizes?.[0] ?? 'Único'); removeFavorite(p.id); }}
                >
                  &#128722; Mover al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rp-empty-state" style={{ paddingBottom: 96 }}>
          <div className="favorites-empty-icon">&#9825;</div>
          <div style={{ fontSize: 15, marginBottom: 20 }}>Aún no guardaste productos favoritos.</div>
          <button className="rp-btn-primary" onClick={() => navigate('/catalogo')}>Explorar catálogo</button>
        </div>
      )}
    </div>
  );
}
