import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export default function Catalog() {
  const { products, apiError } = useApp();
  return (
    <div>
      <div className="detail-breadcrumb" style={{ paddingTop: 20 }}>Inicio &#8250; Catálogo &#8250; Calzado deportivo</div>
      <div className="catalog-header-row">
        <h1 className="rp-h2" style={{ margin: 0 }}>CALZADO DEPORTIVO</h1>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--rp-gray)' }}>{products.length} productos encontrados</div>
      </div>

      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <div className="catalog-filter-group">
            <div className="catalog-filter-title">Categoría</div>
            <label className="catalog-check-label"><input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />Zapatillas running</label>
            <label className="catalog-check-label"><input type="checkbox" style={{ width: 16, height: 16 }} />Calzado casual</label>
            <label className="catalog-check-label"><input type="checkbox" style={{ width: 16, height: 16 }} />Ropa deportiva</label>
            <label className="catalog-check-label"><input type="checkbox" style={{ width: 16, height: 16 }} />Accesorios</label>
          </div>
          <div className="catalog-filter-group">
            <div className="catalog-filter-title">Marca</div>
            <label className="catalog-check-label"><input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />RunPeak Pro</label>
            <label className="catalog-check-label"><input type="checkbox" style={{ width: 16, height: 16 }} />RunPeak Basics</label>
            <label className="catalog-check-label"><input type="checkbox" style={{ width: 16, height: 16 }} />RunPeak Kids</label>
          </div>
          <div className="catalog-filter-group">
            <div className="catalog-filter-title">Talla</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['38', '39', '40', '41', '42'].map(s => <span key={s} className="catalog-size-swatch">{s}</span>)}
            </div>
          </div>
          <div className="catalog-filter-group">
            <div className="catalog-filter-title">Color</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="catalog-color-swatch" style={{ background: 'var(--rp-black)', border: '2px solid var(--rp-black)' }} />
              <span className="catalog-color-swatch" style={{ background: '#fff', border: '2px solid var(--rp-border)' }} />
              <span className="catalog-color-swatch" style={{ background: 'var(--rp-orange)' }} />
              <span className="catalog-color-swatch" style={{ background: 'var(--rp-gray)' }} />
            </div>
          </div>
          <div>
            <div className="catalog-filter-title">Precio</div>
            <div style={{ height: 3, background: 'var(--rp-border)', position: 'relative', marginTop: 12 }}>
              <div style={{ position: 'absolute', left: '20%', right: '35%', top: 0, bottom: 0, background: 'var(--rp-orange)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--rp-gray)', marginTop: 10 }}><span>S/ 60</span><span>S/ 450</span></div>
          </div>
        </aside>

        <div>
          <div className="catalog-search-row">
            <div className="catalog-search-box">&#128269; Buscar por nombre de producto...</div>
            <div className="catalog-sort-box">Ordenar: Más relevante &#9662;</div>
          </div>
          <div className="rp-grid-3">
            {apiError && <div style={{ gridColumn: '1 / -1', color: 'var(--rp-red)' }}>Usando catálogo local: {apiError}</div>}
            {products.map(p => <ProductCard key={p.id} product={p} showStockBadge showSizes />)}
          </div>
        </div>
      </div>
    </div>
  );
}
