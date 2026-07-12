import { useNavigate } from 'react-router-dom';
import { money } from '../data/products';
import { useApp } from '../context/AppContext';

export default function Confirmation() {
  const navigate = useNavigate();
  const { lastOrder } = useApp();
  const items = lastOrder?.items ?? [];
  const total = lastOrder?.total ?? 0;
  const orderNumber = lastOrder?.number ?? 'RP-20260712-0417';

  return (
    <div className="confirmation-wrap">
      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>
        <div className="confirmation-check">&#10003;</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 44, margin: '0 0 10px' }}>¡COMPRA EXITOSA!</h1>
        <p style={{ fontSize: 14, color: 'var(--rp-gray)', marginBottom: 32 }}>Gracias por tu compra. Te enviamos la confirmación a tu correo.</p>

        <div className="confirmation-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--rp-gray)', marginBottom: 18 }}>
            <span>Número de pedido</span><span style={{ fontWeight: 700, color: 'var(--rp-black)' }}>#{orderNumber}</span>
          </div>
          {items.map(c => (
            <div key={c.id + c.size} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10 }}>
              <span>{c.name} &times; {c.qty}</span><span style={{ fontWeight: 700 }}>{money(c.price * c.qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, paddingTop: 16, marginTop: 10, borderTop: '1px solid var(--rp-border)' }}>
            <span>Total pagado</span><span>{money(total)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--rp-gray)', marginTop: 18 }}>
            <span>Entrega estimada</span><span style={{ fontWeight: 700, color: 'var(--rp-black)' }}>14 de julio, 2026</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="rp-btn-primary" onClick={() => navigate('/seguimiento')}>Ver mi pedido</button>
          <button className="rp-btn-outline" onClick={() => navigate('/catalogo')}>Seguir comprando</button>
        </div>
      </div>
    </div>
  );
}
