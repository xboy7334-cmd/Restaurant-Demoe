import type {
  ApiErrorShape,
  CatalogResponse,
  PlaceOrderPayload,
  PlaceOrderResponse,
  Product,
  ResendOtpResponse,
  TrackOrderResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from '../types/api';

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_URL is not configured. Create a .env file from .env.example.');
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const raw = await response.text();
  let data: unknown = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = raw;
  }

  if (!response.ok) {
    const error = data as ApiErrorShape | null;
    throw new Error(error?.message || error?.error || `Request failed with HTTP ${response.status}`);
  }

  return data as T;
}

function normalizeCatalog(data: CatalogResponse | Product[]): CatalogResponse {
  if (Array.isArray(data)) return { products: data };
  return {
    products: data.products ?? [],
    categories: data.categories,
  };
}

export async function getCatalog(): Promise<CatalogResponse> {
  const data = await request<CatalogResponse | Product[]>('/api/catalog');
  return normalizeCatalog(data);
}

export async function getProduct(id: string): Promise<Product & { related?: Product[] }> {
  return request<Product & { related?: Product[] }>(`/api/catalog/${encodeURIComponent(id)}`);
}

export async function placeOrder(payload: PlaceOrderPayload): Promise<PlaceOrderResponse> {
  return request<PlaceOrderResponse>('/api/order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResponse> {
  return request<VerifyOtpResponse>('/api/order/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resendOtp(orderRef: string): Promise<ResendOtpResponse> {
  return request<ResendOtpResponse>('/api/order/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ order_ref: orderRef }),
  });
}

export async function trackOrder(orderRef: string): Promise<TrackOrderResponse> {
  return request<TrackOrderResponse>(`/api/track/${encodeURIComponent(orderRef)}`);
}
