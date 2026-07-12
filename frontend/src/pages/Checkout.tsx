import { useNavigate } from 'react-router-dom';
import { money } from '../data/products';
import { useApp } from '../context/AppContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, shipping, discount, total, couponApplied, applyCoupon, placeOrder } = useApp();

  function confirm() {
    placeOrder();
    navigate('/confirmacion');
  }

  return (
    <div>
      <div className="checkout-steps">
        <div className="checkout-step"><span className="checkout-step-num checkout-step-num--done">&#10003;</span>Carrito</div>
        <div className="checkout-step checkout-step--active"><span className="checkout-step-num checkout-step-num--active">2</span>Envío y pago</div>
        <div className="checkout-step"><span className="checkout-step-num">3</span>Confirmación</div>
      </div>

      <div className="checkout-layout">
        <div>
          <div style={{ marginBottom: 36 }}>
            <div className="checkout-section-title"><span className="checkout-section-num">1</span>Datos de envío</div>
            <div className="rp-form-grid-2" style={{ marginBottom: 16 }}>
              <div className="rp-field"><label>Nombre completo</label><div className="rp-field-value">Carlos Palomino Turpo</div></div>
              <div className="rp-field"><label>Teléfono</label><div className="rp-field-value">+51 987 654 321</div></div>
            </div>
            <div className="rp-field" style={{ marginBottom: 16 }}><label>Dirección</label><div className="rp-field-value">Av. Ejercito 123, Cayma</div></div>
            <div className="rp-form-grid-2">
              <div className="rp-field"><label>Ciudad</label><div className="rp-field-value">Arequipa</div></div>
              <div className="rp-field"><label>Referencia</label><div className="rp-field-value">Frente al parque</div></div>
            </div>
          </div>

          <div>
            <div className="checkout-section-title"><span className="checkout-section-num">2</span>Método de pago</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="payment-option payment-option--selected">
                <span className="payment-radio payment-radio--selected"><span className="payment-radio-dot" /></span>
                Tarjeta de crédito / débito
              </div>
              <div style={{ paddingLeft: 36, marginTop: -8, marginBottom: 8 }}>
                <div className="rp-field" style={{ marginBottom: 12 }}><label>Número de tarjeta</label><div className="rp-field-value">&#8226;&#8226;&#8226;&#8226; &#8226;&#8226;&#8226;&#8226; &#8226;&#8226;&#8226;&#8226; 4242</div></div>
                <div className="rp-form-grid-2">
                  <div className="rp-field"><label>Vencimiento</label><div className="rp-field-value">08 / 28</div></div>
                  <div className="rp-field"><label>CVV</label><div className="rp-field-value">&#8226;&#8226;&#8226;</div></div>
                </div>
              </div>
              <div className="payment-option"><span className="payment-radio" />Yape / Plin</div>
              <div className="payment-option"><span className="payment-radio" />Transferencia bancaria</div>
            </div>
          </div>
        </div>

        <aside className="rp-summary-aside" style={{ position: 'sticky', top: 96 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, margin: '0 0 20px' }}>RESUMEN DEL PEDIDO</h3>
          {cart.map(c => (
            <div key={c.id + c.size} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, flexShrink: 0, backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${c.img})` }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#9a9a9a' }}>Talla {c.size} · Cant. {c.qty}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, marginLeft: 'auto' }}>{money(c.price * c.qty)}</div>
            </div>
          ))}
          <div className="coupon-row">
            <div className="coupon-input">{couponApplied ? 'RUNPEAK10 aplicado' : 'Código de cupón'}</div>
            <button className="coupon-btn" onClick={applyCoupon}>Aplicar</button>
          </div>
          <div className="rp-summary-line"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          {couponApplied && <div className="rp-summary-line"><span>Descuento</span><span>&#8722; {money(discount)}</span></div>}
          <div className="rp-summary-line"><span>Envío</span><span>{shipping ? money(shipping) : 'Gratis'}</span></div>
          <div className="rp-summary-total"><span>Total a pagar</span><span>{money(total)}</span></div>
          <button className="rp-btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={confirm}>Confirmar y pagar &#8594;</button>
        </aside>
      </div>
    </div>
  );
}
