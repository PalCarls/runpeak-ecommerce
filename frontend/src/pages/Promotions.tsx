import { useNavigate } from 'react-router-dom';
import { PROMO_PRODUCTS, COUPONS, money } from '../data/products';

export default function Promotions() {
  const navigate = useNavigate();
  return (
    <div>
      <section className="promo-banner">
        <div className="promo-banner-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1400&q=80')" }} />
        <div className="promo-banner-scrim" />
        <div className="promo-banner-content">
          <div className="rp-eyebrow">Venta de temporada</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 0.95, color: '#FAFAF8', margin: '14px 0' }}>HASTA 20% DTO<br />EN RUNNING Y CASUAL</h1>
          <p style={{ fontSize: 15, color: '#d4d4d4', maxWidth: 460 }}>Precios especiales por tiempo limitado. Válido hasta agotar stock.</p>
        </div>
      </section>

      <section className="rp-section">
        <div className="rp-eyebrow">Ofertas activas</div>
        <h2 className="rp-h2" style={{ fontSize: 42, marginBottom: 32 }}>PRODUCTOS EN OFERTA</h2>
        <div className="rp-grid-4">
          {PROMO_PRODUCTS.map(p => {
            const pct = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
            return (
              <div key={p.id} className="rp-card" onClick={() => navigate(`/producto/${p.id}`)}>
                <div className="rp-card-img" style={{ backgroundImage: `url(${p.img})` }}>
                  <span className="rp-card-badge">-{pct}%</span>
                </div>
                <div className="rp-card-body">
                  <div className="rp-card-category">{p.category}</div>
                  <div className="rp-card-name">{p.name}</div>
                  <div className="rp-card-price">{money(p.price)} <span className="rp-card-oldprice">{p.oldPrice && money(p.oldPrice)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ padding: '0 48px 64px' }}>
        <div className="rp-eyebrow">Ahorra más</div>
        <h2 className="rp-h2" style={{ fontSize: 42, marginBottom: 32 }}>CUPONES DISPONIBLES</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {COUPONS.map(cp => (
            <div key={cp.code} className="coupon-card">
              <div className="coupon-code">{cp.code}</div>
              <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 10px' }}>{cp.desc}</div>
              <div style={{ fontSize: 12, color: 'var(--rp-gray)' }}>Mínimo de compra: {cp.min}</div>
              <div style={{ fontSize: 12, color: 'var(--rp-gray)' }}>Vigencia: {cp.valid}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
