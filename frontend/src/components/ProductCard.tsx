import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { money } from '../data/products';
import { useApp } from '../context/AppContext';

interface Props {
  product: Product;
  showFavorite?: boolean;
  showQuickAdd?: boolean;
  showStockBadge?: boolean;
  showSizes?: boolean;
}

export default function ProductCard({ product, showFavorite, showQuickAdd, showStockBadge, showSizes }: Props) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useApp();
  const isFav = favorites.includes(product.id);

  return (
    <div className="rp-card" onClick={() => navigate(`/producto/${product.id}`)}>
      <div className="rp-card-img" style={{ backgroundImage: `url(${product.img})` }}>
        {product.badge && <span className="rp-card-badge">{product.badge}</span>}
        {showStockBadge && <span className="rp-card-badge rp-card-badge--dark">Stock disponible</span>}
        {showFavorite && (
          <button
            className="rp-card-fav"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
          >
            {isFav ? '\u2665' : '\u2661'}
          </button>
        )}
        {showQuickAdd && (
          <button
            className="rp-card-quickadd"
            onClick={(e) => { e.stopPropagation(); addToCart(product.id, product.name, product.price, product.img, product.sizes?.[0] ?? 'Único'); }}
          >
            +
          </button>
        )}
      </div>
      <div className="rp-card-body">
        <div className="rp-card-category">{product.category}</div>
        <div className="rp-card-name">{product.name}</div>
        <div className="rp-card-price">
          {money(product.price)}
          {product.oldPrice && <span className="rp-card-oldprice">{money(product.oldPrice)}</span>}
        </div>
        {showSizes && product.sizes && (
          <div className="rp-card-sizes">
            {product.sizes.map(s => <span key={s} className="rp-size-chip">{s}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
