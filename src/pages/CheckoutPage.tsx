import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore, cartSubtotal } from '../store/cart';
import { DELIVERY_CHARGE, formatINR } from '../utils/format';
import { placeOrder } from '../utils/api';
import type { Fulfillment } from '../types/api';
import { QuantityStepper } from '../components/QuantityStepper';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../utils/i18n';

export function CheckoutPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const [fulfillment, setFulfillment] = useState<Fulfillment>('delivery');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const delivery = fulfillment === 'delivery' ? DELIVERY_CHARGE : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return <main className="container page-pad"><div className="state-card glass-card"><span className="state-icon">🛒</span><h2>{t(language, 'emptyCart')}</h2><p>{t(language, 'emptyCartHint')}</p><Link className="primary-button" to="/">{t(language, 'browseMenu')}</Link></div></main>;
  }

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await placeOrder({
        items: items.map((item) => ({ product_id: item.product.id, quantity: item.quantity })),
        fulfillment,
        customer: form,
        delivery_charge: delivery,
        subtotal,
        total,
      });
      navigate(`/otp/${encodeURIComponent(response.order_ref)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container page-pad">
      <div className="checkout-header"><Link className="back-link" to="/">← {t(language, 'back')}</Link><h1>{t(language, 'checkout')}</h1></div>
      <div className="checkout-layout">
        <section className="glass-card form-card">
          <div className="toggle-group" role="tablist" aria-label="Fulfillment method">
            <button type="button" className={fulfillment === 'delivery' ? 'active' : ''} onClick={() => setFulfillment('delivery')}>🚴 {t(language, 'delivery')}</button>
            <button type="button" className={fulfillment === 'pickup' ? 'active' : ''} onClick={() => setFulfillment('pickup')}>🏪 {t(language, 'pickup')}</button>
          </div>
          <h2>{t(language, 'customerDetails')}</h2>
          <form onSubmit={submit} className="customer-form">
            <label>{t(language, 'name')}<input required value={form.name} onChange={(e) => update('name', e.target.value)} autoComplete="name" /></label>
            <label>{t(language, 'email')}<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} autoComplete="email" /></label>
            <label>{t(language, 'phone')}<input required type="tel" inputMode="tel" pattern="[0-9+()\- ]{8,}" value={form.phone} onChange={(e) => update('phone', e.target.value)} autoComplete="tel" /></label>
            <label>{t(language, 'notes')}<textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder={t(language, 'notesPlaceholder')} rows={4} /></label>
            {error && <div className="form-error">{error}</div>}
            <button className="primary-button full" disabled={submitting} type="submit">{submitting ? t(language, 'placingOrder') : t(language, 'placeOrder')}</button>
          </form>
        </section>

        <aside className="glass-card order-summary">
          <h2>{t(language, 'orderPlaced')}</h2>
          <div className="summary-lines">
            {items.map((item) => <div className="summary-item" key={item.product.id}><span>{item.product.emoji || '🍽️'} {item.product.name} × {item.quantity}</span><strong>{formatINR(item.product.price * item.quantity)}</strong><QuantityStepper value={item.quantity} onChange={(next) => setQuantity(item.product.id, next)} /></div>)}
          </div>
          <div className="summary-row"><span>{t(language, 'subtotal')}</span><strong>{formatINR(subtotal)}</strong></div>
          <div className="summary-row"><span>{t(language, 'deliveryCharge')}</span><strong>{delivery ? formatINR(delivery) : t(language, 'free')}</strong></div>
          <div className="summary-total"><span>{t(language, 'total')}</span><strong>{formatINR(total)}</strong></div>
        </aside>
      </div>
    </main>
  );
}
