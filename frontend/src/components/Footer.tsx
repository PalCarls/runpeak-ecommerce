import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="rp-footer">
      <div className="rp-footer-grid">
        <div>
          <div className="rp-logo" style={{ marginBottom: 14 }}>RUN<span>PEAK</span></div>
          <p className="rp-footer-copy">Equipamiento deportivo para quienes superan su ritmo todos los días. Hecho para Arequipa, pensado para el mundo.</p>
          <div className="rp-social-row">
            <span className="rp-social-btn">FB</span>
            <span className="rp-social-btn">IG</span>
            <span className="rp-social-btn">TT</span>
          </div>
        </div>
        <div>
          <div className="rp-footer-heading">Tienda</div>
          <div className="rp-footer-links">
            <span>Zapatillas running</span>
            <span>Calzado casual</span>
            <span>Ropa deportiva</span>
            <span>Accesorios</span>
          </div>
        </div>
        <div>
          <div className="rp-footer-heading">Ayuda</div>
          <div className="rp-footer-links">
            <span onClick={() => navigate('/seguimiento')} style={{ cursor: 'pointer' }}>Seguimiento de pedido</span>
            <span>Cambios y devoluciones</span>
            <span>Guía de tallas</span>
            <span onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>Panel administrativo</span>
          </div>
        </div>
        <div>
          <div className="rp-footer-heading">Newsletter</div>
          <p className="rp-footer-copy" style={{ marginBottom: 14 }}>Recibe promociones y lanzamientos antes que nadie.</p>
          <div style={{ display: 'flex' }}>
            <input className="rp-newsletter-input" placeholder="tu@email.com" />
            <button className="rp-newsletter-btn">Unirme</button>
          </div>
        </div>
      </div>
      <div className="rp-footer-bottom">
        <div>&copy; 2026 RUNPEAK — AREQUIPA, PERÚ</div>
        <div>PROYECTO ACADÉMICO · MAESTRÍA EN INGENIERÍA DE SISTEMAS UNSA</div>
      </div>
    </footer>
  );
}
