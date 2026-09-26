import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types/api';
import { getProduct } from '../utils/api';
import { formatINR } from '../utils/format';
import { useCartStore } from '../store/cart';
import { QuantityStepper } from '../components/QuantityStepper';
import { ProductCard } from '../components/ProductCard';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../utils/i18n';

export function ProductDetailPage() {
  const { id = '' } = useParams();
  const { language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const add = useCartStore((state) => state.add);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const line = useCartStore((state) => state.items.find((item) => item.product.id === id));

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getProduct(id);
      setProduct(data);
      setRelated(data.related ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [id]);

  if (loading) return <main className="container page-pad"><LoadingState /></main>;
  if (error || !product) return <main className="container page-pad"><ErrorState message={error || 'Product not found'} onRetry={load} /></main>;

  return (
    <main className="container page-pad">
      <Link className="back-link" to="/">← {t(language, 'back')}</Link>
      <section className="detail-layout glass-card">
        <div className="detail-visual">{product.image ? <img src={product.image} alt={product.name} /> : <span>{product.emoji || '🍽️'}</span>}</div>
        <div className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <strong className="detail-price">{formatINR(product.price)}</strong>
          <p>{product.description}</p>
          {product.available === false ? <span className="unavailable-chip inline">{t(language, 'unavailable')}</span> : (
            <div className="detail-actions">
              {line ? <QuantityStepper value={line.quantity} onChange={(next) => setQuantity(product.id, next)} /> : <button className="primary-button" type="button" onClick={() => add(product)}>{t(language, 'add')}</button>}
              <Link className="secondary-button" to="/checkout">{t(language, 'checkout')}</Link>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">{product.category}</span><h2>{t(language, 'related')}</h2></div></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </main>
  );
}
