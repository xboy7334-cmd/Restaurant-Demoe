import { useEffect, useMemo, useState } from 'react';
import type { Product } from '../types/api';
import { getCatalog } from '../utils/api';
import { ProductCard } from '../components/ProductCard';
import { FloatingCart } from '../components/FloatingCart';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { RestaurantGallery } from '../components/RestaurantGallery';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../utils/i18n';

export function HomePage() {
  const { language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCatalog();
      setProducts(data.products);
      setCategories(data.categories?.length ? data.categories : [...new Set(data.products.map((p) => p.category))]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'apiOffline'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = category === 'All' || product.category === category;
      const searchMatch = !query || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [category, products, search]);

  return (
    <>
      <section className="hero container">
        <div className="hero-copy glass-card">
          <div className="hero-badge">🍽️ {t(language, 'tagline')}</div>
          <h1>{t(language, 'heroTitle')}</h1>
          <p>{t(language, 'heroBody')}</p>
          <div className="hero-pills"><span>{t(language, 'deliveryPill')}</span><span>{t(language, 'pickupPill')}</span></div>
        </div>
        <div className="hero-photo"><img src="/restaurant/exterior.jpg" alt="Your Choice family Restaurant" /></div>
      </section>

      <RestaurantGallery />

      <main className="container catalog-section">
        <div className="section-heading">
          <div><span className="eyebrow">{t(language, 'restaurant')}</span><h2>{t(language, 'menu')}</h2></div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t(language, 'search')} />
          </label>
        </div>

        {!loading && !error && (
          <div className="filter-row" role="list" aria-label="Categories">
            {['All', ...categories].map((item) => (
              <button key={item} className={`filter-pill ${category === item ? 'active' : ''}`} type="button" onClick={() => setCategory(item)}>{item === 'All' ? t(language, 'all') : item}</button>
            ))}
          </div>
        )}

        {loading && <LoadingState />}
        {error && <ErrorState message={error} onRetry={load} />}
        {!loading && !error && filtered.length === 0 && <div className="state-card glass-card">No products match your search.</div>}
        {!loading && !error && filtered.length > 0 && <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </main>
      <FloatingCart />
    </>
  );
}
