import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { RAW_PRODUCTS, money } from '../data/products';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const SIZE_OPTIONS = ['37', '38', '39', '40', '41', '42'];
const DISABLED_SIZES = ['37', '42'];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, subtotal, shipping, favorites, toggleFavorite, addToCart } = useApp();
  const product = RAW_PRODUCTS.find(p => p.id === id) ?? RAW_PRODUCTS[0];
  const [size, setSize] = useState('39');
  const [qty, setQty] = useState(1);
  const isFav = favorites.includes(product.id);
  const related = RAW_PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);
  const total = subtotal + shipping;

  return (
    <div>
      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-breadcrumb">Inicio &#8250; Catálogo &#8250; {product.category} &#8250; {product.name}</div>
          <div className="detail-grid">
            <div>
              <div className="detail-image" style={{ backgroundImage: `url(${product.img.replace('w=500', 'w=900')})` }}>
                <button className="detail-fav-btn" onClick={() => toggleFavorite(product.id)}>{isFav ? '\u2665' : '\u2661'}</button>
              </div>
              <div className="detail-thumbs">
                {[product.img, ...related.slice(0, 3).map(r => r.img)].map((img, i) => (
                  <div key={i} className={'detail-thumb' + (i === 0 ? ' detail-thumb--active' : '')} style={{ backgroundImage: `url(${img.replace('w=500', 'w=200')})` }} />
                ))}
              </div>
            </div>

            <div>
              <div className="detail-category">{product.category} · RunPeak Pro</div>
              <h1 className="detail-title">{product.name.toUpperCase()}</h1>
              <div className="detail-price">{money(product.price)}</div>
              <div className="detail-stock">&#10003; Stock disponible en tu talla</div>

              <div className="detail-option-group">
                <div className="detail-option-label">Color: Negro / Naranja</div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span className="detail-color-swatch" style={{ background: 'var(--rp-black)', border: '2px solid var(--rp-black)' }} />
                  <span className="detail-color-swatch" style={{ background: '#fff', border: '1px solid var(--rp-border)' }} />
                  <span className="detail-color-swatch" style={{ background: 'var(--rp-orange)' }} />
                </div>
              </div>

              <div className="detail-option-group">
                <div className="detail-option-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Talla</span><span style={{ fontWeight: 400, textTransform: 'none', textDecoration: 'underline', color: 'var(--rp-gray)', cursor: 'pointer' }}>Guía de tallas</span>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {SIZE_OPTIONS.map(sz => {
                    const disabled = DISABLED_SIZES.includes(sz);
                    const selected = sz === size;
                    return (
                      <span
                        key={sz}
                        className={'detail-size-chip' + (disabled ? ' detail-size-chip--disabled' : selected ? ' detail-size-chip--selected' : '')}
                        onClick={() => !disabled && setSize(sz)}
                      >
                        {sz}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="detail-option-group">
                <div className="detail-option-label">Cantidad</div>
                <div className="detail-qty-control">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>&#8722;</button>
                  <span className="detail-qty-value">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>

              <div className="detail-actions">
                <button className="rp-btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} onClick={() => addToCart(product.id, product.name, product.price, product.img, size, qty)}>
                  &#128722; Agregar al carrito
                </button>
                <button className="rp-btn-outline" style={{ display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => toggleFavorite(product.id)}>
                  {isFav ? '\u2665' : '\u2661'} <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{isFav ? 'En favoritos' : 'Agregar a favoritos'}</span>
                </button>
              </div>

              <div className="detail-description">
                Zapatilla de running diseñada para entrenamientos de media y larga distancia. Amortiguación reactiva, malla transpirable y suela de alta tracción para superficies urbanas y de trail ligero.
              </div>
            </div>
          </div>
        </div>

        <aside className="detail-cart-aside">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 18px' }}>MI CARRITO ({cart.reduce((s, c) => s + c.qty, 0)})</h3>
          {cart.map(c => (
            <div key={c.id + c.size} className="rp-cart-row">
              <div className="rp-cart-row-img" style={{ backgroundImage: `url(${c.img})` }} />
              <div>
                <div className="rp-cart-row-name">{c.name}</div>
                <div className="rp-cart-row-meta">Talla {c.size} · {c.color} · Cant. {c.qty}</div>
                <div className="rp-cart-row-price">{money(c.price * c.qty)}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 18, borderTop: '1px solid var(--rp-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--rp-gray)', marginBottom: 10 }}><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--rp-gray)', marginBottom: 10 }}><span>Envío</span><span>{shipping ? money(shipping) : 'Gratis'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginTop: 14 }}><span>Total</span><span>{money(total)}</span></div>
            <button className="rp-btn-primary" style={{ width: '100%', marginTop: 18 }} onClick={() => navigate('/carrito')}>Ir a pagar &#8594;</button>
          </div>
        </aside>
      </div>

      <section className="related-section">
        <div className="rp-eyebrow">También te puede interesar</div>
        <h2 className="rp-h2" style={{ fontSize: 36, marginBottom: 28 }}>PRODUCTOS RELACIONADOS</h2>
        <div className="rp-grid-4">
          {related.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}

