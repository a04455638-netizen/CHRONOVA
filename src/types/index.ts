export type MovementType = 'Avtomatik' | 'Mexanik' | 'Kvarts' | 'Turbiyon' | 'Xronograf';
export type CrystalType = 'Sapfir' | 'Mineral' | 'Xezalit';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cash_on_delivery' | 'card_upon_receipt';
export type DeliveryType = 'standard' | 'express' | 'pickup';
export type UserRole = 'customer' | 'admin' | 'manager';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin_country: string;
  description: string;
  logo_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  dial_color?: string;
  strap_color?: string;
  case_size_mm?: number;
  price_adjustment_uzs: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductSpec {
  spec_group: string;
  spec_name: string;
  spec_value: string;
}

export interface Product {
  id: string;
  brand_id: string;
  category_id: string;
  name: string;
  slug: string;
  model_number: string;
  sku: string;
  description: string;
  movement_type: MovementType;
  case_material: string;
  case_diameter_mm: number;
  water_resistance_atm: number;
  crystal_type: CrystalType;
  strap_material: string;
  dial_color: string;
  warranty_years: number;
  base_price_uzs: number;
  sale_price_uzs?: number | null;
  stock_quantity: number;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  images: ProductImage[];
  variants?: ProductVariant[];
  specs?: ProductSpec[];
  brand?: Brand;
  category?: Category;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant | null;
  quantity: number;
  selectedPriceUzs: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  variant_id?: string;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price_uzs: number;
  quantity: number;
  total_price_uzs: number;
}

export interface OrderStatusHistoryItem {
  id: string;
  order_id: string;
  previous_status?: string | null;
  new_status: OrderStatus;
  comment?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  delivery_region: string;
  delivery_city: string;
  delivery_address: string;
  delivery_notes?: string | null;
  delivery_type: DeliveryType;
  payment_method: PaymentMethod;
  subtotal_uzs: number;
  discount_uzs: number;
  delivery_fee_uzs: number;
  total_uzs: number;
  status: OrderStatus;
  tracking_token: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  status_history?: OrderStatusHistoryItem[];
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount_uzs: number;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  customer_name: string;
  rating: number;
  title?: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface NotificationOutboxItem {
  id: string;
  channel: 'telegram' | 'email' | 'sms';
  payload: any;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  last_error?: string;
  created_at: string;
  sent_at?: string;
}

export interface FilterOptions {
  search?: string;
  brand?: string;
  category?: string;
  movement?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'name_asc' | 'newest';
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  email?: string;
  region: string;
  city: string;
  address: string;
  ordersCount: number;
  totalSpentUzs: number;
  lastOrderDate: string;
  status: 'vip' | 'regular' | 'new';
}

