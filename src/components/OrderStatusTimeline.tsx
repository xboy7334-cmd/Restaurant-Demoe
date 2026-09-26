import type { OrderStatus } from '../types/api';
import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';

const statuses: OrderStatus[] = ['verified', 'accepted', 'paid', 'shipped', 'delivered'];

export function OrderStatusTimeline({ current }: { current: OrderStatus }) {
  const { language } = useLanguage();
  const currentIndex = statuses.indexOf(current);

  return (
    <div className="timeline" aria-label="Order status">
      {statuses.map((status, index) => {
        const done = index <= currentIndex;
        return (
          <div className={`timeline-item ${done ? 'done' : ''}`} key={status}>
            <div className="timeline-dot">{done ? '✓' : index + 1}</div>
            <div><strong>{t(language, status)}</strong><small>{index < currentIndex ? 'Complete' : index === currentIndex ? 'Current' : 'Pending'}</small></div>
          </div>
        );
      })}
    </div>
  );
}
