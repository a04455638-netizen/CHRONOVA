import {
  Product,
  Brand,
  Category,
  Order,
  Coupon,
  Review,
  FilterOptions,
  NotificationOutboxItem,
} from '@/types';
import {
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
} from './mock-watches';
import { sendTelegramNotification } from '../telegram';

export interface MaintenanceStatus {
  enabled: boolean;
  reason: string;
  updated_at: string;
}

interface ChronovaGlobalStore {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  coupons: Coupon[];
  orders: Order[];
  outbox: NotificationOutboxItem[];
  reviews: Review[];
  maintenance: MaintenanceStatus;
}

const g = globalThis as unknown as { __chronova_store__?: ChronovaGlobalStore };

if (!g.__chronova_store__) {
  g.__chronova_store__ = {
    products: [...INITIAL_PRODUCTS],
    brands: [...INITIAL_BRANDS],
    categories: [...INITIAL_CATEGORIES],
    coupons: [...INITIAL_COUPONS],
    orders: [...INITIAL_ORDERS],
    outbox: [],
    maintenance: {
      enabled: false,
      reason: 'Hozirda platformada rejalashtirilgan yangilanish yoki profilaktika ishlari olib borilmoqda. Xarid va buyurtmalar xavfsizligini ta’minlash maqsadida xizmat vaqtincha to‘xtatildi.',
      updated_at: new Date().toISOString(),
    },
    reviews: [
      {
        id: 'rev-1',
        product_id: 'p-rolex-submariner',
        customer_name: 'Farhod Aliyev',
        rating: 5,
        title: 'Ajoyib Shveytsariya sifati!',
        comment: 'Soat Toshkentdagi manzilimizga 3 soat ichida yetib keldi. Sertifikati, qutisi va barcha hujjatlari joyida. Rahmat CHRONOVA!',
        status: 'approved',
        created_at: '2026-10-25T12:00:00Z',
      },
      {
        id: 'rev-2',
        product_id: 'p-omega-speedmaster',
        customer_name: 'Bobur Mirzayev',
        rating: 5,
        title: 'Haqiqiy xronograf ixlosmandlari uchun',
        comment: 'Moonwatch qo‘lda juda qulay turadi. Mexanik kalibrning ishlashi betakror.',
        status: 'approved',
        created_at: '2026-10-27T15:30:00Z',
      },
    ],
  };
}

if (!g.__chronova_store__.maintenance) {
  g.__chronova_store__.maintenance = {
    enabled: false,
    reason: 'Hozirda platformada rejalashtirilgan yangilanish yoki profilaktika ishlari olib borilmoqda. Xarid va buyurtmalar xavfsizligini ta’minlash maqsadida xizmat vaqtincha to‘xtatildi.',
    updated_at: new Date().toISOString(),
  };
}

const state = g.__chronova_store__;

// Helper: attach brand and category to product
function hydrateProduct(p: Product): Product {
  const brand = state.brands.find((b) => b.id === p.brand_id);
  const category = state.categories.find((c) => c.id === p.category_id);
  return {
    ...p,
    brand,
    category,
  };
}

export const DataStore = {
  // BRANDS
  async getBrands(): Promise<Brand[]> {
    return state.brands.filter((b) => b.is_active);
  },

  async getAllBrandsAdmin(): Promise<Brand[]> {
    return state.brands;
  },

  async getBrandBySlug(slug: string): Promise<Brand | undefined> {
    return state.brands.find((b) => b.slug === slug);
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    return state.categories.filter((c) => c.is_active);
  },

  async getAllCategoriesAdmin(): Promise<Category[]> {
    return state.categories;
  },

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return state.categories.find((c) => c.slug === slug);
  },

  // PRODUCTS
  async getProducts(options?: FilterOptions): Promise<Product[]> {
    let list = state.products.filter((p) => p.is_published).map(hydrateProduct);

    if (!options) return list;

    if (options.search && options.search.trim() !== '') {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.model_number.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand?.name.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q)
      );
    }

    if (options.brand && options.brand !== 'all') {
      list = list.filter((p) => p.brand?.slug === options.brand || p.brand_id === options.brand);
    }

    if (options.category && options.category !== 'all') {
      list = list.filter((p) => p.category?.slug === options.category || p.category_id === options.category);
    }

    if (options.movement && options.movement !== 'all') {
      list = list.filter((p) => p.movement_type === options.movement);
    }

    if (options.minPrice !== undefined) {
      list = list.filter((p) => (p.sale_price_uzs || p.base_price_uzs) >= options.minPrice!);
    }

    if (options.maxPrice !== undefined) {
      list = list.filter((p) => (p.sale_price_uzs || p.base_price_uzs) <= options.maxPrice!);
    }

    if (options.inStockOnly) {
      list = list.filter((p) => p.stock_quantity > 0);
    }

    if (options.sortBy) {
      if (options.sortBy === 'price_asc') {
        list.sort((a, b) => (a.sale_price_uzs || a.base_price_uzs) - (b.sale_price_uzs || b.base_price_uzs));
      } else if (options.sortBy === 'price_desc') {
        list.sort((a, b) => (b.sale_price_uzs || b.base_price_uzs) - (a.sale_price_uzs || a.base_price_uzs));
      } else if (options.sortBy === 'name_asc') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === 'newest') {
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    return list;
  },

  async getAllProductsAdmin(): Promise<Product[]> {
    return state.products.map(hydrateProduct);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return state.products.filter((p) => p.is_published && p.is_featured).map(hydrateProduct);
  },

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const p = state.products.find((item) => item.slug === slug);
    return p ? hydrateProduct(p) : undefined;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    const p = state.products.find((item) => item.id === id);
    return p ? hydrateProduct(p) : undefined;
  },

  async saveProduct(productData: Partial<Product>): Promise<Product> {
    if (productData.id) {
      const idx = state.products.findIndex((p) => p.id === productData.id);
      if (idx !== -1) {
        state.products[idx] = {
          ...state.products[idx],
          ...productData,
        } as Product;
        return hydrateProduct(state.products[idx]);
      }
    }

    // New product
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      brand_id: productData.brand_id || state.brands[0].id,
      category_id: productData.category_id || state.categories[0].id,
      name: productData.name || 'Yangi Soat',
      slug: productData.slug || `watch-${Date.now()}`,
      model_number: productData.model_number || 'REF-000',
      sku: productData.sku || `SKU-${Date.now()}`,
      description: productData.description || 'Shveytsariya lyuks soati tavsifi.',
      movement_type: productData.movement_type || 'Avtomatik',
      case_material: productData.case_material || '316L Po‘lat',
      case_diameter_mm: productData.case_diameter_mm || 40,
      water_resistance_atm: productData.water_resistance_atm || 5,
      crystal_type: productData.crystal_type || 'Sapfir',
      strap_material: productData.strap_material || 'Po‘lat bilaguzuk',
      dial_color: productData.dial_color || 'Qora',
      warranty_years: productData.warranty_years || 2,
      base_price_uzs: productData.base_price_uzs || 10000000,
      sale_price_uzs: productData.sale_price_uzs || null,
      stock_quantity: productData.stock_quantity ?? 5,
      is_featured: productData.is_featured ?? false,
      is_published: productData.is_published ?? true,
      created_at: new Date().toISOString(),
      images: productData.images && productData.images.length > 0 ? productData.images : [
        {
          id: `img-${Date.now()}`,
          product_id: `p-${Date.now()}`,
          image_url: '/images/watches/rolex-submariner.jpg',
          alt_text: productData.name || 'Soat surati',
          display_order: 1,
          is_primary: true,
        }
      ],
      specs: productData.specs || [],
    };

    state.products.unshift(newProduct);
    return hydrateProduct(newProduct);
  },

  async deleteProduct(id: string): Promise<boolean> {
    const lenBefore = state.products.length;
    state.products = state.products.filter((p) => p.id !== id);
    return state.products.length < lenBefore;
  },

  // COUPONS
  async validateCoupon(code: string, subtotalUzs: number): Promise<{ valid: boolean; discountUzs: number; message?: string }> {
    const coupon = state.coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase().trim() && c.is_active
    );

    if (!coupon) {
      return { valid: false, discountUzs: 0, message: 'Kupon kodi topilmadi yoki muddati o‘tgan' };
    }

    if (subtotalUzs < coupon.min_order_amount_uzs) {
      return {
        valid: false,
        discountUzs: 0,
        message: `Ushbu kupon faqat minimal ${coupon.min_order_amount_uzs.toLocaleString()} so‘mlik xaridlar uchun amal qiladi`,
      };
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = Math.round((subtotalUzs * coupon.discount_value) / 100);
    } else {
      discount = coupon.discount_value;
    }

    if (discount > subtotalUzs) discount = subtotalUzs;

    return { valid: true, discountUzs: discount };
  },

  // ORDERS & ATOMIC CHECKOUT
  async createOrderAtomic(data: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_region: string;
    delivery_city: string;
    delivery_address: string;
    delivery_notes?: string;
    delivery_type: 'standard' | 'express';
    payment_method: 'cash_on_delivery' | 'card_upon_receipt';
    coupon_code?: string;
    items: Array<{ product_id: string; quantity: number }>;
    idempotency_key?: string;
  }): Promise<{ success: boolean; order?: Order; error?: string }> {
    // 1. Idempotency check
    if (data.idempotency_key) {
      const existing = state.orders.find((o) => (o as any).idempotency_key === data.idempotency_key);
      if (existing) {
        return { success: true, order: existing };
      }
    }

    // 2. Validate items, prices, and stock
    let subtotal = 0;
    const orderItems: any[] = [];
    const updatedProducts: Array<{ id: string; newStock: number }> = [];

    for (const item of data.items) {
      const product = state.products.find((p) => p.id === item.product_id);
      if (!product) {
        return { success: false, error: `Mahsulot topilmadi: ${item.product_id}` };
      }
      if (product.stock_quantity < item.quantity) {
        return {
          success: false,
          error: `Kechirasiz, "${product.name}" soati bo‘yicha yetarli qoldiq mavjud emas (Mavjud: ${product.stock_quantity})`,
        };
      }

      const itemPrice = product.sale_price_uzs || product.base_price_uzs;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        order_id: '',
        product_id: product.id,
        product_name_snapshot: product.name,
        sku_snapshot: product.sku,
        unit_price_uzs: itemPrice,
        quantity: item.quantity,
        total_price_uzs: itemTotal,
      });

      updatedProducts.push({
        id: product.id,
        newStock: product.stock_quantity - item.quantity,
      });
    }

    // 3. Coupon discount
    let discount = 0;
    if (data.coupon_code) {
      const couponRes = await this.validateCoupon(data.coupon_code, subtotal);
      if (couponRes.valid) {
        discount = couponRes.discountUzs;
      }
    }

    const deliveryFee = data.delivery_type === 'express' ? 50000 : 0;
    const total = subtotal - discount + deliveryFee;

    // 4. Decrement stock
    for (const up of updatedProducts) {
      const p = state.products.find((prod) => prod.id === up.id);
      if (p) p.stock_quantity = up.newStock;
    }

    // 5. Generate human-readable order number
    const orderNumber = `CHR-26-${Math.floor(10000 + Math.random() * 90000)}`;
    const orderId = `ord-${Date.now()}`;
    const trackingToken = `trk_${Math.random().toString(36).slice(2, 12)}`;

    orderItems.forEach((oi) => (oi.order_id = orderId));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email,
      delivery_region: data.delivery_region,
      delivery_city: data.delivery_city,
      delivery_address: data.delivery_address,
      delivery_notes: data.delivery_notes,
      delivery_type: data.delivery_type,
      payment_method: data.payment_method,
      subtotal_uzs: subtotal,
      discount_uzs: discount,
      delivery_fee_uzs: deliveryFee,
      total_uzs: total,
      status: 'pending',
      tracking_token: trackingToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: orderItems,
      status_history: [
        {
          id: `sh-${Date.now()}`,
          order_id: orderId,
          previous_status: null,
          new_status: 'pending',
          comment: 'Buyurtma muvaffaqiyatli qabul qilindi',
          created_at: new Date().toISOString(),
        },
      ],
    };

    state.orders.unshift(newOrder);

    // 6. Push to Notification Outbox & Trigger Telegram Bot
    const outboxItem: NotificationOutboxItem = {
      id: `outbox-${orderId}`,
      channel: 'telegram',
      payload: {
        order_id: orderId,
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        region: data.delivery_region,
        city: data.delivery_city,
        address: data.delivery_address,
        delivery_notes: data.delivery_notes,
        payment_method: data.payment_method,
        total_uzs: total,
        subtotal_uzs: subtotal,
        discount_uzs: discount,
        items: orderItems.map((oi) => ({
          name: oi.product_name_snapshot,
          sku: oi.sku_snapshot,
          qty: oi.quantity,
          price_uzs: oi.unit_price_uzs,
          total_uzs: oi.total_price_uzs,
        })),
        created_at: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
      },
      status: 'pending',
      attempts: 1,
      created_at: new Date().toISOString(),
    };

    state.outbox.unshift(outboxItem);

    // Asynchronously dispatch to Telegram Bot API
    try {
      const tgRes = await sendTelegramNotification(outboxItem.payload);
      if (tgRes.success) {
        outboxItem.status = 'sent';
        outboxItem.sent_at = new Date().toISOString();
      } else {
        outboxItem.status = 'failed';
        outboxItem.last_error = tgRes.error;
      }
    } catch (err: any) {
      outboxItem.status = 'failed';
      outboxItem.last_error = err.message;
    }

    return { success: true, order: newOrder };
  },

  async getOrders(): Promise<Order[]> {
    return state.orders;
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    return state.orders.find((o) => o.id === id || o.order_number === id);
  },

  async trackOrder(identifier: string, phone?: string): Promise<Order | undefined> {
    const cleanId = identifier.trim().toUpperCase();
    const order = state.orders.find(
      (o) =>
        o.order_number.toUpperCase() === cleanId ||
        o.id === identifier ||
        o.tracking_token === identifier
    );

    if (!order) return undefined;

    // If phone is provided, verify matching last 4 digits for privacy
    if (phone && phone.trim() !== '') {
      const cleanInputPhone = phone.replace(/\D/g, '');
      const cleanOrderPhone = order.customer_phone.replace(/\D/g, '');
      if (cleanInputPhone.length >= 4 && !cleanOrderPhone.endsWith(cleanInputPhone.slice(-4))) {
        return undefined; // Security guard against IDOR
      }
    }

    return order;
  },

  async updateOrderStatus(
    orderId: string,
    newStatus: Order['status'],
    comment?: string
  ): Promise<Order | undefined> {
    const order = state.orders.find((o) => o.id === orderId || o.order_number === orderId);
    if (!order) return undefined;

    const prev = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    if (!order.status_history) order.status_history = [];
    order.status_history.push({
      id: `sh-${Date.now()}`,
      order_id: order.id,
      previous_status: prev,
      new_status: newStatus,
      comment: comment || `Status o‘zgardi: ${prev} -> ${newStatus}`,
      created_at: new Date().toISOString(),
    });

    return order;
  },

  // OUTBOX & AUDIT
  async getOutboxLogs(): Promise<NotificationOutboxItem[]> {
    return state.outbox;
  },

  // REVIEWS
  async getReviewsForProduct(productId: string): Promise<Review[]> {
    return state.reviews.filter((r) => r.product_id === productId && r.status === 'approved');
  },

  async getAllReviewsAdmin(): Promise<Review[]> {
    return state.reviews;
  },

  async addReview(data: Omit<Review, 'id' | 'created_at' | 'status'>): Promise<Review> {
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      status: 'pending', // Requires admin approval
      created_at: new Date().toISOString(),
    };
    state.reviews.unshift(newReview);
    return newReview;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<Review | undefined> {
    const rev = state.reviews.find((r) => r.id === id);
    if (rev) {
      rev.status = status;
      return rev;
    }
    return undefined;
  },

  async deleteReview(id: string): Promise<boolean> {
    const prevLen = state.reviews.length;
    state.reviews = state.reviews.filter((r) => r.id !== id);
    return state.reviews.length < prevLen;
  },

  // CATEGORIES CRUD
  async saveCategory(catData: Partial<Category>): Promise<Category> {
    if (catData.id) {
      const idx = state.categories.findIndex((c) => c.id === catData.id);
      if (idx !== -1) {
        state.categories[idx] = {
          ...state.categories[idx],
          ...catData,
        } as Category;
        return state.categories[idx];
      }
    }

    const newCategory: Category = {
      id: catData.id || `cat-${Date.now()}`,
      name: catData.name || 'Yangi Kategoriya',
      slug: catData.slug || `cat-${Date.now()}`,
      description: catData.description || 'Shveytsariya soatlari toifasi.',
      image_url: catData.image_url || '/images/watches/rolex-submariner.jpg',
      display_order: catData.display_order ?? state.categories.length + 1,
      is_active: catData.is_active ?? true,
    };
    state.categories.push(newCategory);
    return newCategory;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const prevLen = state.categories.length;
    state.categories = state.categories.filter((c) => c.id !== id);
    return state.categories.length < prevLen;
  },

  // INVENTORY MANAGEMENT
  async updateProductStock(id: string, newStock: number): Promise<Product | undefined> {
    const p = state.products.find((prod) => prod.id === id);
    if (p) {
      p.stock_quantity = Math.max(0, newStock);
      return hydrateProduct(p);
    }
    return undefined;
  },

  // COUPONS CRUD
  async getCoupons(): Promise<Coupon[]> {
    return state.coupons;
  },

  async saveCoupon(couponData: Partial<Coupon>): Promise<Coupon> {
    if (couponData.id) {
      const idx = state.coupons.findIndex((c) => c.id === couponData.id);
      if (idx !== -1) {
        state.coupons[idx] = {
          ...state.coupons[idx],
          ...couponData,
        } as Coupon;
        return state.coupons[idx];
      }
    }

    const newCoupon: Coupon = {
      id: couponData.id || `cp-${Date.now()}`,
      code: (couponData.code || `PROMO${Math.floor(10 + Math.random() * 90)}`).toUpperCase().trim(),
      discount_type: couponData.discount_type || 'percentage',
      discount_value: couponData.discount_value || 10,
      min_order_amount_uzs: couponData.min_order_amount_uzs || 10000000,
      current_uses: 0,
      max_uses: couponData.max_uses || 100,
      is_active: couponData.is_active ?? true,
      expires_at: couponData.expires_at || new Date(Date.now() + 30 * 86400000).toISOString(),
    };
    state.coupons.unshift(newCoupon);
    return newCoupon;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    const prevLen = state.coupons.length;
    state.coupons = state.coupons.filter((c) => c.id !== id);
    return state.coupons.length < prevLen;
  },

  // CUSTOMERS (Computed from Real Orders)
  async getCustomers(): Promise<import('@/types').CustomerSummary[]> {
    const customerMap = new Map<string, {
      name: string;
      phone: string;
      email?: string;
      region: string;
      city: string;
      address: string;
      ordersCount: number;
      totalSpentUzs: number;
      lastOrderDate: string;
    }>();

    for (const ord of state.orders) {
      const phoneKey = ord.customer_phone.replace(/\D/g, '') || ord.customer_phone;
      const existing = customerMap.get(phoneKey);

      if (existing) {
        existing.ordersCount += 1;
        if (ord.status !== 'cancelled') {
          existing.totalSpentUzs += ord.total_uzs;
        }
        if (new Date(ord.created_at).getTime() > new Date(existing.lastOrderDate).getTime()) {
          existing.lastOrderDate = ord.created_at;
          existing.address = ord.delivery_address;
          existing.region = ord.delivery_region;
          existing.city = ord.delivery_city;
        }
      } else {
        customerMap.set(phoneKey, {
          name: ord.customer_name,
          phone: ord.customer_phone,
          email: ord.customer_email || undefined,
          region: ord.delivery_region,
          city: ord.delivery_city,
          address: ord.delivery_address,
          ordersCount: 1,
          totalSpentUzs: ord.status !== 'cancelled' ? ord.total_uzs : 0,
          lastOrderDate: ord.created_at,
        });
      }
    }

    return Array.from(customerMap.entries()).map(([phone, data], idx) => {
      let status: 'vip' | 'regular' | 'new' = 'new';
      if (data.totalSpentUzs >= 100000000 || data.ordersCount >= 3) {
        status = 'vip';
      } else if (data.ordersCount > 1) {
        status = 'regular';
      }

      return {
        id: `cust-${idx + 1}`,
        name: data.name,
        phone: data.phone,
        email: data.email,
        region: data.region,
        city: data.city,
        address: data.address,
        ordersCount: data.ordersCount,
        totalSpentUzs: data.totalSpentUzs,
        lastOrderDate: data.lastOrderDate,
        status,
      };
    });
  },

  // ADMIN KPI & ANALYTICS
  async getAdminStats() {
    const totalOrders = state.orders.length;
    const totalRevenue = state.orders.reduce((sum, o) => (o.status !== 'cancelled' ? sum + o.total_uzs : sum), 0);
    const pendingOrders = state.orders.filter((o) => o.status === 'pending').length;
    const totalProducts = state.products.length;
    const lowStockWatches = state.products.filter((p) => p.stock_quantity < 5);
    const outOfStockWatches = state.products.filter((p) => p.stock_quantity === 0);

    // Compute unique customer count
    const uniquePhones = new Set(state.orders.map((o) => o.customer_phone.replace(/\D/g, '')));
    const totalCustomers = uniquePhones.size || 1;

    // Top selling watches calculated from order items
    const salesMap = new Map<string, { qty: number; revenue: number }>();
    for (const ord of state.orders) {
      if (ord.status !== 'cancelled') {
        for (const item of ord.items || []) {
          const prev = salesMap.get(item.product_id || item.product_name_snapshot) || { qty: 0, revenue: 0 };
          salesMap.set(item.product_id || item.product_name_snapshot, {
            qty: prev.qty + item.quantity,
            revenue: prev.revenue + item.total_price_uzs,
          });
        }
      }
    }

    const topSellingWatches = Array.from(salesMap.entries())
      .map(([prodId, s]) => {
        const prod = state.products.find((p) => p.id === prodId || p.name === prodId);
        return {
          id: prodId,
          name: prod ? prod.name : prodId,
          model_number: prod?.model_number || 'REF-CHRONOVA',
          image: prod?.images?.[0]?.image_url || '/images/watches/rolex-submariner.jpg',
          unitsSold: s.qty,
          totalRevenueUzs: s.revenue,
          currentStock: prod ? prod.stock_quantity : 0,
        };
      })
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Timeline / Sales Chart Data (Aggregate by date or mock timeline with real orders)
    const timelineData = [
      { label: 'Dushanba', revenue: Math.round(totalRevenue * 0.12), orders: 1 },
      { label: 'Seshanba', revenue: Math.round(totalRevenue * 0.18), orders: 2 },
      { label: 'Chorshanba', revenue: Math.round(totalRevenue * 0.08), orders: 1 },
      { label: 'Payshanba', revenue: Math.round(totalRevenue * 0.22), orders: 2 },
      { label: 'Juma', revenue: Math.round(totalRevenue * 0.15), orders: 1 },
      { label: 'Shanba', revenue: Math.round(totalRevenue * 0.15), orders: 2 },
      { label: 'Yakshanba', revenue: Math.round(totalRevenue * 0.10), orders: 1 },
    ];

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      lowStockCount: lowStockWatches.length,
      outOfStockCount: outOfStockWatches.length,
      lowStockWatches,
      recentOrders: state.orders.slice(0, 6),
      topSellingWatches,
      timelineData,
    };
  },

  // MAINTENANCE MODE (TEXNIK TANAFFUS)
  async getMaintenanceStatus(): Promise<MaintenanceStatus> {
    return state.maintenance;
  },

  async setMaintenanceStatus(enabled: boolean, reason?: string): Promise<MaintenanceStatus> {
    state.maintenance = {
      enabled,
      reason: reason !== undefined ? reason : state.maintenance.reason,
      updated_at: new Date().toISOString(),
    };
    return state.maintenance;
  },
};

