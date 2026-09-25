# Your Choice family Restaurant — React + TypeScript + Vite

Production-oriented, mobile-first restaurant ordering frontend with a quick-commerce UI.

## Included

- Vite + React + TypeScript
- React Router v6 with lazy-loaded pages
- Zustand 5 cart with `localStorage` persistence
- Dark glassmorphism UI with purple `#7C6FE9` and success green `#34D399`
- Mobile-first 2-column catalog, 3-column tablet, 4-column desktop
- English / Bengali custom i18n toggle
- Live catalog and order lifecycle through the requested API endpoints
- Delivery ₹40 flat; self-pickup free
- 6-digit OTP flow with auto-focus, backspace navigation and resend cooldown
- Order tracking timeline: Verified → Accepted → Paid → Shipped → Delivered
- Payment button driven by `payment_url` returned by the API
- Confetti after a successful payment callback using `?payment=success`
- The four supplied restaurant photos are included under `public/restaurant/`
- No product catalog is hardcoded in the frontend; products are loaded from `/api/catalog`
- Hash routing is used so the SPA works on static GitHub Pages hosting without server rewrite rules

## Run locally

```bash
npm install
cp .env.example .env
```

Set the API base URL in `.env`:

```env
VITE_API_URL=https://api.yourrestaurant.com
```

Then:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## API contract

See `API_CONTRACT.md`. The frontend expects JSON and uses the exact endpoints requested:

- `GET /api/catalog`
- `GET /api/catalog/:id`
- `POST /api/order`
- `POST /api/order/verify`
- `POST /api/order/resend-otp`
- `GET /api/track/:order_ref`

The API should return CORS headers allowing the deployed frontend origin.

## GitHub Pages

This project uses `HashRouter`, so direct navigation to a route does not require server-side rewrite support.

Recommended GitHub Pages setup:

1. Push the whole project to GitHub.
2. Add `VITE_API_URL` as a GitHub Actions repository variable/secret or generate `.env` during the build.
3. Build with `npm run build`.
4. Publish the `dist/` directory using GitHub Actions.

Do not put secrets in `VITE_API_URL`: Vite exposes `VITE_*` variables to browser code. It must contain only a public API base URL.

## Payment callback

When `/api/track/:order_ref` reports `status: "accepted"` and includes `payment_url`, the tracking page renders the payment button.

Your payment provider/backend should return the browser to:

```text
<frontend-origin>/#/track/<order_ref>?payment=success
```

The frontend then triggers confetti and refreshes order status.

## Security / production notes

- Authentication, OTP generation, OTP delivery, payment signing, rate limiting, authorization, inventory checks, and order validation must be implemented server-side.
- Never trust prices or totals posted by the browser. The backend should recalculate the order from product IDs and current prices before accepting payment.
- Configure strict CORS on the API.
- Use HTTPS in production.
- Validate phone numbers and customer fields server-side as well as in the browser.
- If payment provider webhooks are used, the server—not the frontend—should be the source of truth for `paid` status.
