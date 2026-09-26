import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { LoadingState } from './components/LoadingState';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OtpPage = lazy(() => import('./pages/OtpPage').then((m) => ({ default: m.OtpPage })));
const TrackingPage = lazy(() => import('./pages/TrackingPage').then((m) => ({ default: m.TrackingPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Suspense fallback={<main className="container page-pad"><LoadingState /></main>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/otp/:orderRef" element={<OtpPage />} />
          <Route path="/track/:orderRef" element={<TrackingPage />} />
          <Route path="/menu" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <footer className="site-footer"><div className="container"><strong>Your Choice family Restaurant</strong><span>Best restaurant in Haldia · ₹40 delivery · Free self-pickup</span></div></footer>
    </div>
  );
}
