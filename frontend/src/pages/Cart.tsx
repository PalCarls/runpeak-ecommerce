import { useNavigate } from 'react-router-dom';
import { money } from '../data/products';
import { useApp } from '../context/AppContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, updateQty, removeItem } = useApp();
  const total = subtotal + shipping;

  return (
    <div>
      <div style={{ padding: '36px 48px 8px' }}>
        <h1 className="rp-h2" style={{ margin: 0 }}>TU CARRITO</h1>
      </div>

      <div className="cart-layout">
        <div>
          {cart.length > 0 ? (
            cart.map(c => (
              <div key={c.id + c.size} className="cart-full-row">
                <div className="cart-full-img" style={{ backgroundImage: `url(${c.img})` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--rp-gray)' }}>Talla {c.size} · {c.color}</div>
                </div>
                <div className="cart-qty-control">
                  <button onClick={() => updateQty(c.id, c.size, -1)}>&#8722;</button>
                  <span style={{ width: 36, textAlign: 'center', fontSize: 13, fontWeight: 700 }}>{c.qty}</span>
                  <button onClick={() => updateQty(c.id, c.size, 1)}>+</button>
                </div>
                <div style={{ width: 100, textAlign: 'right', fontSize: 15, fontWeight: 800 }}>{money(c.price * c.qty)}</div>
                <button style={{ border: 'none', background: 'transparent', color: 'var(--rp-gray)', fontSize: 16, cursor: 'pointer' }} onClick={() => removeItem(c.id, c.size)}>&#10005;</button>
              </div>
            ))
          ) : (
            <div className="rp-empty-state">
              <div style={{ fontSize: 15, marginBottom: 20 }}>Tu carrito está vacío.</div>
              <button className="rp-btn-primary" onClick={() => navigate('/catalogo')}>Ir al catálogo</button>
            </div>
          )}
        </div>

        <aside className="rp-summary-aside">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 20px' }}>RESUMEN</h3>
          <div className="rp-summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="rp-summary-line"><span>Envío</span><span>{shipping ? money(shipping) : 'Gratis'}</span></div>
          <div className="rp-summary-total"><span>Total</span><span>{money(total)}</span></div>
          <button className="rp-btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={() => navigate('/checkout')}>Proceder al pago &#8594;</button>
        </aside>
      </div>
    </div>
  );
}
