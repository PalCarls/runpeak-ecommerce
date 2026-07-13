import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RAW_PRODUCTS, money } from '../data/products';

const CHIPS = ['Zapatillas', 'Ropa deportiva', 'Mochilas', 'Gorras', 'Accesorios', 'Ofertas'];

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useApp();
  const [query, setQuery] = useState('Zapatillas running');
  const navigate = useNavigate();

  if (!searchOpen) return null;

  const results = RAW_PRODUCTS.slice(0, 4);

  return (
    <div className="rp-search-overlay" onClick={() => setSearchOpen(false)}>
      <div className="rp-search-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rp-search-close" onClick={() => setSearchOpen(false)}>&#10005;</button>

        <div className="rp-search-input-wrap">
          <span className="rp-search-icon">&#128269;</span>
          <input
            autoFocus
            className="rp-search-input"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="rp-search-section">
          <div className="rp-search-label">Búsquedas populares</div>
          <div className="rp-search-chips">
            {CHIPS.map(chip => (
              <span
                key={chip}
                className="rp-chip"
                onClick={() => { setSearchOpen(false); navigate(chip === 'Ofertas' ? '/promociones' : '/catalogo'); }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="rp-search-label">Resultados</div>
          <div className="rp-search-results">
            {results.map(p => (
              <div key={p.id} className="rp-search-result" onClick={() => { setSearchOpen(false); navigate(`/producto/${p.id}`); }}>
                <div className="rp-search-result-img" style={{ backgroundImage: `url(${p.img})` }} />
                <div className="rp-search-result-body">
                  <div className="rp-search-result-name">{p.name}</div>
                  <div className="rp-search-result-price">{money(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
