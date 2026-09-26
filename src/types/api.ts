export type Language = 'en' | 'bn';
export type Fulfillment = 'delivery' | 'pickup';
export type OrderStatus = 'verified' | 'accepted' | 'paid' | 'shipped' | 'delivered';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
  description: string;
  image?: string;
  available?: boolean;
}

export interface CatalogResponse {
  products: Product[];
  categories?: string[];
}

export interface OrderItemPayload {
  product_id: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface PlaceOrderPayload {
  items: OrderItemPayload[];
  fulfillment: Fulfillment;
  customer: CustomerInfo;
  delivery_charge: number;
  subtotal: number;
  total: number;
}

export interface PlaceOrderResponse {
  order_ref: string;
  status: OrderStatus;
  payment_url?: string;
  message?: string;
}

export interface VerifyOtpPayload {
  order_ref: string;
  otp: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  status: OrderStatus;
  message?: string;
}

export interface ResendOtpResponse {
  sent: boolean;
  cooldown_seconds?: number;
  message?: string;
}

export interface TrackOrderResponse {
  order_ref: string;
  status: OrderStatus;
  updated_at?: string;
  eta?: string;
  payment_url?: string;
  shipping?: {
    carrier?: string;
    tracking_number?: string;
    address?: string;
  };
  customer?: Pick<CustomerInfo, 'name' | 'phone'>;
  items?: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
    emoji?: string;
  }>;
  subtotal?: number;
  delivery_charge?: number;
  total?: number;
}

export interface ApiErrorShape {
  message?: string;
  error?: string;
}
