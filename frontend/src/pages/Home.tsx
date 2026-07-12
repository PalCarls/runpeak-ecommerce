import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { RAW_PRODUCTS, TESTIMONIALS } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

const SIZES = ['38', '39', '40', '41', '42'];

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [heroSize, setHeroSize] = useState('39');
  const hero = RAW_PRODUCTS[0];

  return (
    <div>
      <section className="home-hero">
        <div className="home-hero-bg" style={{ backgroundImage: `url(${hero.img.replace('w=500', 'w=1400')})` }} />
        <div className="home-hero-scrim" />
        <div className="home-hero-content">
          <div>
            <div className="rp-eyebrow">Colección running · 2026</div>
            <h1 className="home-hero-title">SUPERA<br />TU RITMO</h1>
            <p className="home-hero-copy">Zapatillas, ropa y accesorios deportivos pensados para acompañar cada kilómetro. Rendimiento real, para gente real de Arequipa.</p>
          </div>
          <div className="home-hero-card">
            <div className="rp-eyebrow" style={{ marginBottom: 6 }}>Producto destacado</div>
            <h2>{hero.name.toUpperCase()}</h2>
            <div className="home-hero-price">S/ {hero.price.toFixed(2)}</div>
            <div className="detail-option-label" style={{ color: '#9a9a9a' }}>Talla</div>
            <div className="home-size-row">
              {SIZES.map(sz => (
                <span
                  key={sz}
                  className={'home-size-chip' + (sz === heroSize ? ' home-size-chip--active' : '')}
                  onClick={() => setHeroSize(sz)}
                >
                  {sz}
                </span>
              ))}
            </div>
            <button className="rp-btn-primary" style={{ width: '100%' }} onClick={() => addToCart(hero.id, hero.name, hero.price, hero.img, heroSize)}>
              &#128722; Agregar al carrito
            </button>
          </div>
        </div>
      </section>

      <div className="home-strip">
        <div className="home-strip-item"><span>&#9670;</span>Envío en 24-48h Arequipa</div>
        <div className="home-strip-item"><span>&#9670;</span>Pago 100% seguro</div>
        <div className="home-strip-item"><span>&#9670;</span>Cambios hasta 30 días</div>
        <div className="home-strip-item" style={{ borderRight: 'none' }}><span>&#9670;</span>Garantía de fábrica</div>
      </div>

      <section className="rp-section rp-section--border-top">
        <div className="rp-eyebrow">Nuestra propuesta</div>
        <h2 className="rp-h2">POR QUÉ ELEGIR RUNPEAK</h2>
        <div className="home-why-grid">
          <div className="home-why-item"><div className="home-why-num">01</div><h3>Calidad garantizada</h3><p>Materiales premium seleccionados para rendimiento y durabilidad en cada uso.</p></div>
          <div className="home-why-item"><div className="home-why-num">02</div><h3>Mejor precio</h3><p>Precios competitivos sin comprometer la calidad del producto que recibes.</p></div>
          <div className="home-why-item"><div className="home-why-num">03</div><h3>Entrega rápida</h3><p>Seguimiento en tiempo real desde la confirmación hasta la entrega final.</p></div>
          <div className="home-why-item"><div className="home-why-num">04</div><h3>Garantía de fábrica</h3><p>Cambios y devoluciones sin complicaciones hasta 30 días después de tu compra.</p></div>
        </div>
      </section>

      <section className="rp-section">
        <div className="rp-section-header">
          <div>
            <div className="rp-eyebrow">Catálogo</div>
            <h2 className="rp-h2">NUESTROS PRODUCTOS</h2>
          </div>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/catalogo'); }} style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '2px solid var(--rp-orange)', paddingBottom: 2 }}>Ver todo &#8594;</a>
        </div>
        <div className="rp-grid-4">
          {RAW_PRODUCTS.map(p => <ProductCard key={p.id} product={p} showFavorite showQuickAdd />)}
        </div>
      </section>

      <section className="rp-section rp-section--border-top home-about-grid">
        <div className="home-about-img" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80')" }} />
        <div>
          <div className="rp-eyebrow">Nuestra historia</div>
          <h2 className="rp-h2" style={{ marginBottom: 20 }}>HECHOS EN AREQUIPA,<br />PARA CADA ATLETA</h2>
          <p style={{ fontSize: 15, color: 'var(--rp-gray)', lineHeight: 1.7, maxWidth: 520 }}>RunPeak nació en Arequipa con una idea simple: equipar a corredores y deportistas locales con productos de calidad real, sin depender de importaciones lentas ni precios inflados.</p>
          <p style={{ fontSize: 15, color: 'var(--rp-gray)', lineHeight: 1.7, maxWidth: 520, marginBottom: 28 }}>Hoy trabajamos con atletas de la región para diseñar calzado, ropa y accesorios probados en las calles y cerros que conocemos bien.</p>
          <div className="home-about-stats">
            <div><div className="home-about-stat-num">+8,000</div><div className="home-about-stat-label">Clientes en Arequipa</div></div>
            <div><div className="home-about-stat-num">4.8/5</div><div className="home-about-stat-label">Calificación promedio</div></div>
            <div><div className="home-about-stat-num">24-48h</div><div className="home-about-stat-label">Tiempo de entrega</div></div>
          </div>
        </div>
      </section>

      <section className="rp-section rp-section--dark">
        <div className="rp-eyebrow">Lo que dicen</div>
        <h2 className="rp-h2" style={{ color: '#fff', marginBottom: 36 }}>CLIENTES QUE CONFÍAN EN RUNPEAK</h2>
        <div className="home-testimonial-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="home-testimonial-card">
              <div className="home-testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p style={{ fontSize: 14, color: '#d4d4d4', lineHeight: 1.7, marginBottom: 20 }}>"{t.quote}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="home-testimonial-avatar" style={{ backgroundImage: `url(${t.photo})` }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#7a7a7a' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
