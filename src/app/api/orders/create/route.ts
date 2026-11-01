import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { validateUzbekPhone, normalizeUzbekPhone } from '@/lib/utils/format';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_region,
      delivery_city,
      delivery_address,
      delivery_notes,
      delivery_type = 'standard',
      payment_method = 'cash_on_delivery',
      coupon_code,
      items,
      idempotency_key,
    } = body;

    // 1. Validation
    if (!customer_name || customer_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Iltimos, to‘liq ism va familiyangizni kiriting.' },
        { status: 400 }
      );
    }

    if (!customer_phone || !validateUzbekPhone(customer_phone)) {
      return NextResponse.json(
        { error: 'Yaroqsiz telefon raqami. Iltimos, +998 bilan boshlanuvchi O‘zbekiston raqamini kiriting.' },
        { status: 400 }
      );
    }

    if (!delivery_region || !delivery_city || !delivery_address) {
      return NextResponse.json(
        { error: 'Iltimos, yetkazib berish viloyati, shahri va aniq manzilini to‘liq kiriting.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Xarid savatingiz bo‘sh.' },
        { status: 400 }
      );
    }

    // 2. Execute Atomic Order Creation via DataStore
    const result = await DataStore.createOrderAtomic({
      customer_name: customer_name.trim(),
      customer_phone: normalizeUzbekPhone(customer_phone),
      customer_email: customer_email?.trim() || null,
      delivery_region,
      delivery_city: delivery_city.trim(),
      delivery_address: delivery_address.trim(),
      delivery_notes: delivery_notes?.trim() || null,
      delivery_type,
      payment_method,
      coupon_code: coupon_code?.trim() || null,
      items,
      idempotency_key: idempotency_key || `ord-idem-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        { error: result.error || 'Buyurtma rasmiylashtirishda xatolik yuz berdi.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: result.order,
      order_number: result.order.order_number,
      tracking_token: result.order.tracking_token,
    });
  } catch (error: any) {
    console.error('[Create Order API Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Server xatosi. Iltimos, qaytadan urinib ko‘ring.' },
      { status: 500 }
    );
  }
}
