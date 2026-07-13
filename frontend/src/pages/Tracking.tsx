import { useApp } from '../context/AppContext';
import { money } from '../data/products';

const STEPS = ['Recibido', 'En preparación', 'Despachado', 'En tránsito', 'Entregado'];
const DATES = ['12 jul, 9:14 am', '12 jul, 11:40 am', '12 jul, 4:05 pm', '13 jul, 8:20 am', 'Pendiente'];
const CURRENT_STEP = 3; // En tránsito
const STATUS_DETAILS: Record<number, string> = {
  0: 'Hemos recibido tu pedido y está siendo validado.',
  1: 'Tu pedido está siendo preparado y empacado en nuestro almacén de Arequipa.',
  2: 'Tu pedido salió de nuestro almacén rumbo al centro de distribución.',
  3: 'Tu pedido va en camino y llegará pronto a la dirección indicada.',
  4: 'Tu pedido fue entregado con éxito. ¡Gracias por tu compra!'
};

export default function Tracking() {
  const { lastOrder, cart } = useApp();
  const items = lastOrder ? lastOrder.items : cart;
  const total = lastOrder ? lastOrder.total : items.reduce((s, c) => s + c.price * c.qty, 0) + (items.length ? 15 : 0);
  const orderNumber = lastOrder ? lastOrder.number : 'RP-20260712-0417';

  return (
    <div>
      <div style={{ padding: '44px 48px 8px' }}>
        <div className="rp-eyebrow">Pedido confirmado</div>
        <h1 className="rp-h2" style={{ marginBottom: 4 }}>SEGUIMIENTO DE PEDIDO</h1>
        <div style={{ fontSize: 13, color: 'var(--rp-gray)' }}>Pedido #{orderNumber} · Realizado el 12 de julio, 2026</div>
      </div>

      <div className="tracking-steps-row">
        {STEPS.map((label, i) => {
          const done = i < CURRENT_STEP;
          const active = i === CURRENT_STEP;
          return (
            <div key={label} className="tracking-step">
              {i > 0 && <div className="tracking-line" style={{ background: i <= CURRENT_STEP ? 'var(--rp-green)' : 'var(--rp-border)' }} />}
              <div className="tracking-dot" style={{ background: done ? 'var(--rp-green)' : active ? 'var(--rp-orange)' : 'var(--rp-border)', color: done || active ? '#fff' : 'var(--rp-gray)' }}>
                {done ? '✓' : i + 1}
              </div>
              <div className="tracking-label" style={{ color: active ? 'var(--rp-black)' : 'var(--rp-gray)' }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--rp-gray)', marginTop: 4 }}>{DATES[i]}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 44, padding: '8px 48px 72px' }}>
        <div style={{ border: '1px solid var(--rp-border)', padding: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, marginBottom: 6 }}>{STEPS[CURRENT_STEP]}</div>
          <p style={{ fontSize: 14, color: 'var(--rp-gray)', lineHeight: 1.7, marginBottom: 24 }}>{STATUS_DETAILS[CURRENT_STEP]}</p>
          <div className="tracking-detail-grid">
            <div><div className="rp-field-label">Dirección de entrega</div><div style={{ fontSize: 13 }}>Av. Ejercito 123, Cayma, Arequipa</div></div>
            <div><div className="rp-field-label">Entrega estimada</div><div style={{ fontSize: 13 }}>14 de julio, 2026</div></div>
            <div><div className="rp-field-label">Transportista</div><div style={{ fontSize: 13 }}>RunPeak Express</div></div>
            <div><div className="rp-field-label">Código de seguimiento</div><div style={{ fontSize: 13 }}>RPX-884213-PE</div></div>
          </div>
        </div>

        <aside className="rp-summary-aside">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '0 0 18px' }}>PRODUCTOS DEL PEDIDO</h3>
          {items.map(c => (
            <div key={c.id + c.size} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, flexShrink: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${c.img})` }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#9a9a9a' }}>Talla {c.size} · Cant. {c.qty}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, marginLeft: 'auto' }}>{money(c.price * c.qty)}</div>
            </div>
          ))}
          <div className="rp-summary-total"><span>Total pagado</span><span>{money(total)}</span></div>
        </aside>
      </div>
    </div>
  );
}
