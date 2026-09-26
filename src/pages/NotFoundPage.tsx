import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <main className="container narrow-page page-pad"><div className="state-card glass-card"><span className="state-icon">🍽️</span><h1>Page not found</h1><p>The page you requested does not exist.</p><Link className="primary-button" to="/">Back to menu</Link></div></main>;
}
