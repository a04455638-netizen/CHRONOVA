import { NextRequest, NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({
      success: true,
      mock: true,
      message: 'Simulyatsiya rejimi: TELEGRAM_BOT_TOKEN yoki TELEGRAM_ADMIN_CHAT_ID .env faylida o‘rnatilmagan. Sozlangandan so‘ng real Telegram chatiga xabar boradi.',
    });
  }

  const testPayload = {
    order_id: 'test-101',
    order_number: 'CHR-TEST-001',
    customer_name: 'CHRONOVA Sinov Xabari',
    customer_phone: '+998 71 200 90 90',
    region: 'Toshkent shahri',
    city: 'Yunusobod',
    address: 'Amir Temur shoh ko‘chasi, 108',
    delivery_notes: 'Bot aloqasi va xabarnomalar tizimi muvaffaqiyatli sinovdan o‘tdi!',
    payment_method: 'cash_on_delivery',
    total_uzs: 185000000,
    subtotal_uzs: 185000000,
    discount_uzs: 0,
    items: [
      {
        name: 'Rolex Submariner Date 41mm',
        sku: 'ROL-SUB-126610LN',
        qty: 1,
        price_uzs: 185000000,
        total_uzs: 185000000,
      },
    ],
    created_at: new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' }),
  };

  const res = await sendTelegramNotification(testPayload);

  if (res.success) {
    return NextResponse.json({
      success: true,
      mock: res.mock,
      message: res.mock ? 'Simulyatsiya muvaffaqiyatli.' : 'Real Telegram admin chatiga sinov xabari yuborildi!',
    });
  } else {
    return NextResponse.json({
      success: false,
      error: res.error,
    }, { status: 500 });
  }
}
