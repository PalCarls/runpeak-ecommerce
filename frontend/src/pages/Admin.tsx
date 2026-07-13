import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ADMIN_ORDERS, SALES_BY_MONTH, TOP_PRODUCTS, money } from '../data/products';

type Tab = 'productos' | 'promociones' | 'pedidos' | 'reportes';
const TABS: { key: Tab; label: string }[] = [
  { key: 'productos', label: 'Productos' },
  { key: 'promociones', label: 'Promociones' },
  { key: 'pedidos', label: 'Pedidos' },
  { key: 'reportes', label: 'Reportes' }
];

const STATUS_COLOR: Record<string, string> = {
  'Recibido': 'var(--rp-gray)', 'En preparación': 'var(--rp-amber)', 'Despachado': 'var(--rp-blue)',
  'En tránsito': 'var(--rp-orange)', 'Entregado': 'var(--rp-green)'
};

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('productos');
  const { adminProducts, adminCoupons, toggleAdminProductStatus, removeAdminProduct, addAdminProduct, removeAdminCoupon, addAdminPromo } = useApp();
  const maxSale = Math.max(...SALES_BY_MONTH.map(m => m.value));
  const maxUnits = Math.max(...TOP_PRODUCTS.map(t => t.units));

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">RUN<span style={{ color: 'var(--rp-orange)' }}>PEAK</span>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#7a7a7a', marginTop: 6 }}>Panel administrativo</div>
        </div>
        {TABS.map(t => (
          <div key={t.key} className={'admin-nav-item' + (tab === t.key ? ' admin-nav-item--active' : '')} onClick={() => setTab(t.key)}>{t.label}</div>
        ))}
        <div style={{ padding: 24, marginTop: 24 }}>
          <button className="rp-btn-outline rp-btn-outline--dark" style={{ width: '100%' }} onClick={() => navigate('/')}>&#8592; Salir al sitio</button>
        </div>
      </aside>

      <div className="admin-content">
        {tab === 'productos' && (
          <div>
            <div className="admin-header-row">
              <h1 className="rp-h2" style={{ fontSize: 36, margin: 0 }}>GESTIÓN DE PRODUCTOS</h1>
              <button className="rp-btn-primary" style={{ padding: '12px 20px' }} onClick={addAdminProduct}>+ Nuevo producto</button>
            </div>
            <div className="admin-table">
              <div className="admin-table-head" style={{ gridTemplateColumns: '64px 2fr 1.2fr 0.8fr 0.9fr 1fr 1.2fr' }}>
                <span></span><span>Nombre</span><span>Categoría</span><span>Stock</span><span>Precio</span><span>Estado</span><span>Acciones</span>
              </div>
              {adminProducts.map(p => (
                <div key={p.id} className="admin-table-row" style={{ gridTemplateColumns: '64px 2fr 1.2fr 0.8fr 0.9fr 1fr 1.2fr' }}>
                  <div className="admin-table-thumb" style={{ backgroundImage: `url(${p.img})` }} />
                  <span style={{ fontWeight: 700 }}>{p.name}</span>
                  <span style={{ color: 'var(--rp-gray)' }}>{p.category}</span>
                  <span>{p.stock}</span>
                  <span style={{ fontWeight: 700 }}>{money(p.price)}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: p.active ? 'var(--rp-green)' : 'var(--rp-red)' }}>{p.active ? 'Activo' : 'Agotado'}</span>
                  <span style={{ display: 'flex', gap: 8 }}>
                    <button className="admin-btn-edit" onClick={() => toggleAdminProductStatus(p.id)}>Editar</button>
                    <button className="admin-btn-delete" onClick={() => removeAdminProduct(p.id)}>Eliminar</button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'promociones' && (
          <div>
            <div className="admin-header-row">
              <h1 className="rp-h2" style={{ fontSize: 36, margin: 0 }}>PROMOCIONES</h1>
              <button className="rp-btn-primary" style={{ padding: '12px 20px' }} onClick={addAdminPromo}>+ Nueva promoción</button>
            </div>
            <div className="admin-table">
              <div className="admin-table-head" style={{ gridTemplateColumns: '1.2fr 2fr 1fr 1fr 0.8fr' }}>
                <span>Código</span><span>Descripción</span><span>Mín. compra</span><span>Vigencia</span><span>Acciones</span>
              </div>
              {adminCoupons.map(cp => (
                <div key={cp.code} className="admin-table-row" style={{ gridTemplateColumns: '1.2fr 2fr 1fr 1fr 0.8fr' }}>
                  <span style={{ fontWeight: 700, color: 'var(--rp-orange)' }}>{cp.code}</span>
                  <span>{cp.desc}</span>
                  <span style={{ color: 'var(--rp-gray)' }}>{cp.min}</span>
                  <span style={{ color: 'var(--rp-gray)' }}>{cp.valid}</span>
                  <button className="admin-btn-delete" style={{ width: 'fit-content' }} onClick={() => removeAdminCoupon(cp.code)}>Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'pedidos' && (
          <div>
            <h1 className="rp-h2" style={{ fontSize: 36, marginBottom: 24 }}>PEDIDOS</h1>
            <div className="admin-table">
              <div className="admin-table-head" style={{ gridTemplateColumns: '1.2fr 1.6fr 1fr 1fr 1.2fr 0.8fr' }}>
                <span>Pedido</span><span>Cliente</span><span>Fecha</span><span>Total</span><span>Estado</span><span>Acción</span>
              </div>
              {ADMIN_ORDERS.map(o => (
                <div key={o.id} className="admin-table-row" style={{ gridTemplateColumns: '1.2fr 1.6fr 1fr 1fr 1.2fr 0.8fr' }}>
                  <span style={{ fontWeight: 700 }}>{o.id}</span>
                  <span>{o.client}</span>
                  <span style={{ color: 'var(--rp-gray)' }}>{o.date}</span>
                  <span style={{ fontWeight: 700 }}>{money(o.total)}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: STATUS_COLOR[o.status] }}>{o.status}</span>
                  <button className="admin-btn-edit" style={{ width: 'fit-content' }}>Ver</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'reportes' && (
          <div>
            <h1 className="rp-h2" style={{ fontSize: 36, marginBottom: 24 }}>REPORTES</h1>
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card"><div className="admin-kpi-label">Ventas totales (mes)</div><div className="admin-kpi-value">S/ 48,320</div></div>
              <div className="admin-kpi-card"><div className="admin-kpi-label">Pedidos (mes)</div><div className="admin-kpi-value">186</div></div>
              <div className="admin-kpi-card admin-kpi-card--accent"><div className="admin-kpi-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Productos con stock bajo</div><div className="admin-kpi-value">3</div></div>
            </div>
            <div className="admin-charts-grid">
              <div className="admin-chart-card">
                <div className="admin-chart-title">Ventas por mes</div>
                <div className="admin-bar-chart">
                  {SALES_BY_MONTH.map(m => (
                    <div key={m.label} className="admin-bar-col">
                      <div className="admin-bar" style={{ height: Math.round((m.value / maxSale) * 140) }} />
                      <div style={{ fontSize: 11, color: 'var(--rp-gray)', marginTop: 8 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="admin-chart-card">
                <div className="admin-chart-title">Productos más vendidos</div>
                {TOP_PRODUCTS.map(tp => (
                  <div key={tp.name} className="admin-toplist-row">
                    <div className="admin-toplist-header"><span>{tp.name}</span><span>{tp.units} u.</span></div>
                    <div className="admin-toplist-track"><div className="admin-toplist-bar" style={{ width: `${Math.round((tp.units / maxUnits) * 100)}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
