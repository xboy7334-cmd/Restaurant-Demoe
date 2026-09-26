import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, cartCount } from '../store/cart';
import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';

export function Header() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const { language, setLanguage } = useLanguage();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={t(language, 'brand')}>
          <span className="brand-mark">YC</span>
          <span>
            <strong>Your Choice</strong>
            <small>family Restaurant</small>
          </span>
        </Link>

        <nav className="header-actions" aria-label="Primary navigation">
          <Link className="header-link desktop-only" to="/">
            {t(language, 'menu')}
          </Link>
          <button
            className="lang-toggle"
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            aria-label="Switch language"
          >
            {language === 'en' ? 'বাংলা' : 'EN'}
          </button>
          <button className="cart-button" type="button" onClick={() => navigate('/checkout')}>
            <span aria-hidden="true">🛒</span>
            <span>{t(language, 'cart')}</span>
            {cartCount(items) > 0 && <b className="badge">{cartCount(items)}</b>}
          </button>
        </nav>
      </div>
    </header>
  );
}
