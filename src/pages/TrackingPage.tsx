import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import type { TrackOrderResponse } from '../types/api';
import { trackOrder } from '../utils/api';
import { formatDate, formatINR } from '../utils/format';
import { OrderStatusTimeline } from '../components/OrderStatusTimeline';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../utils/i18n';

export function TrackingPage() {
  const { language } = useLanguage();
  const { orderRef = '' } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState<TrackOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentCelebrated, setPaymentCelebrated] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setOrder(await trackOrder(orderRef));
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'error'));
    } finally {
      setLoading(false);
    }
  }, [language, orderRef]);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (searchParams.get('payment') === 'success' && !paymentCelebrated) {
      setPaymentCelebrated(true);
      confetti({ particleCount: 160, spread: 90, origin: { y: 0.65 } });
      void load();
    }
  }, [load, paymentCelebrated, searchParams]);

  if (loading) return <main className="container narrow-page page-pad"><LoadingState /></main>;
  if (error || !order) return <main className="container narrow-page page-pad"><ErrorState message={error || t(language, 'error')} onRetry={load} /></main>;

  const canPay = order.status === 'accepted' && Boolean(order.payment_url);
  const total = order.total ?? ((order.subtotal ?? 0) + (order.delivery_charge ?? 0));

  return (
    <main className="container page-pad">
      <section className="track-header glass-card">
        <div><span className="eyebrow">{t(language, 'orderTracking')}</span><h1>#{order.order_ref}</h1><p>{order.updated_at ? formatDate(order.updated_at) : ''}{order.eta ? ` · ETA ${order.eta}` : ''}</p></div>
        <div className="track-total"><small>{t(language, 'total')}</small><strong>{formatINR(total)}</strong></div>
      </section>

      <div className="tracking-grid">
        <section className="glass-card tracking-card">
          <OrderStatusTimeline current={order.status} />
          {canPay && <a className="primary-button full payment-button" href={order.payment_url}>{t(language, 'payNow')}</a>}
          {searchParams.get('payment') === 'success' && <div className="success-banner">🎉 {t(language, 'paymentDone')}</div>}
        </section>

        {order.shipping && order.status === 'shipped' || order.shipping && order.status === 'delivered' ? (
          <section className="glass-card info-card"><h2>{t(language, 'shippingInfo')}</h2><dl><dt>Carrier</dt><dd>{order.shipping.carrier || '—'}</dd><dt>Tracking</dt><dd>{order.shipping.tracking_number || '—'}</dd><dt>Address</dt><dd>{order.shipping.address || '—'}</dd></dl></section>
        ) : null}

        {order.items && order.items.length > 0 && <section className="glass-card info-card"><h2>{t(language, 'orderTracking')}</h2>{order.items.map((item) => <div className="track-line" key={item.product_id}><span>{item.emoji || '🍽️'} {item.name} × {item.quantity}</span><strong>{formatINR(item.price * item.quantity)}</strong></div>)}</section>}
      </div>
      <Link className="secondary-button centered-button" to="/">{t(language, 'browseMenu')}</Link>
    </main>
  );
}
