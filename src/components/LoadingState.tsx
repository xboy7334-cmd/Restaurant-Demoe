import { useLanguage } from './LanguageProvider';
import { t } from '../utils/i18n';

export function LoadingState() {
  const { language } = useLanguage();
  return <div className="state-card glass-card"><span className="spinner" />{t(language, 'loading')}</div>;
}
