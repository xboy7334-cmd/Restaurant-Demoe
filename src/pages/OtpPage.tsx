import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resendOtp, verifyOtp } from '../utils/api';
import { useCartStore } from '../store/cart';
import { useLanguage } from '../components/LanguageProvider';
import { t } from '../utils/i18n';

export function OtpPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { orderRef = '' } = useParams();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [cooldown, setCooldown] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const clearCart = useCartStore((state) => state.clear);

  useEffect(() => {
    refs.current[0]?.focus();
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const updateDigit = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const otp = digits.join('');
    if (otp.length !== 6) {
      setError('Enter all 6 digits.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await verifyOtp({ order_ref: orderRef, otp });
      if (!response.verified) throw new Error(response.message || 'OTP verification failed.');
      clearCart();
      navigate(`/track/${encodeURIComponent(orderRef)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'error'));
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      const response = await resendOtp(orderRef);
      setCooldown(response.cooldown_seconds ?? 30);
    } catch (err) {
      setError(err instanceof Error ? err.message : t(language, 'error'));
    }
  };

  return (
    <main className="container narrow-page page-pad">
      <section className="glass-card otp-card">
        <span className="otp-icon">🔐</span>
        <span className="eyebrow">{t(language, 'orderRef')}: {orderRef}</span>
        <h1>{t(language, 'verifyOtp')}</h1>
        <p>{t(language, 'otpSent')}</p>
        <form onSubmit={submit}>
          <div className="otp-inputs" aria-label="6 digit OTP">
            {digits.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element; }} value={digit} onChange={(event) => updateDigit(index, event)} onKeyDown={(event) => handleKeyDown(index, event)} inputMode="numeric" maxLength={1} aria-label={`OTP digit ${index + 1}`} />)}
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-button full" disabled={submitting} type="submit">{submitting ? t(language, 'loading') : t(language, 'verifyOtp')}</button>
        </form>
        <button className="text-button" type="button" disabled={cooldown > 0} onClick={resend}>{t(language, 'resend')} {cooldown > 0 && `(${t(language, 'resendIn')} ${cooldown}${t(language, 'seconds')})`}</button>
      </section>
    </main>
  );
}
