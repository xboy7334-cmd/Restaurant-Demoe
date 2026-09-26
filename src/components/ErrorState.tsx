import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const { language } = useLanguage();
  return (
    <div className="state-card glass-card error-state">
      <span className="state-icon">⚠️</span>
      <strong>{t(language, 'error')}</strong>
      <p>{message}</p>
      {onRetry && <button className="secondary-button" type="button" onClick={onRetry}>{t(language, 'retry')}</button>}
    </div>
  );
}
