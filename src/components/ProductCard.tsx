import { Link } from 'react-router-dom';
import type { Product } from '../types/api';
import { formatINR } from '../utils/format';
import { useCartStore } from '../store/cart';
import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';
import { QuantityStepper } from './QuantityStepper';

export function ProductCard({ product }: { product: Product }) {
  const { language } = useLanguage();
  const add = useCartStore((state) => state.add);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const line = useCartStore((state) => state.items.find((item) => item.product.id === product.id));
  const quantity = line?.quantity ?? 0;

  return (
    <article className="product-card glass-card">
      <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-visual" aria-label={product.name}>
        {product.image ? <img src={product.image} alt="" loading="lazy" /> : <span>{product.emoji || '🍽️'}</span>}
        {product.available === false && <span className="unavailable-chip">{t(language, 'unavailable')}</span>}
      </Link>
      <div className="product-copy">
        <div className="eyebrow">{product.category}</div>
        <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-title">{product.name}</Link>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>{formatINR(product.price)}</strong>
          {product.available === false ? (
            <span className="muted">{t(language, 'unavailable')}</span>
          ) : quantity > 0 ? (
            <QuantityStepper value={quantity} onChange={(next) => setQuantity(product.id, next)} />
          ) : (
            <button className="add-button" type="button" onClick={() => add(product)}>{t(language, 'add')}</button>
          )}
        </div>
      </div>
    </article>
  );
}
