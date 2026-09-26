import { useNavigate } from 'react-router-dom';
import { useCartStore, cartCount, cartSubtotal } from '../store/cart';
import { formatINR } from '../utils/format';
import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';

export function FloatingCart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const { language } = useLanguage();
  const count = cartCount(items);
  if (!count) return null;

  return (
    <button className="floating-cart" type="button" onClick={() => navigate('/checkout')}>
      <span className="floating-cart-icon">🛒</span>
      <span className="floating-cart-copy"><b>{count} {t(language, 'cart')}</b><small>{formatINR(cartSubtotal(items))}</small></span>
      <span className="floating-cart-arrow">→</span>
    </button>
  );
}
