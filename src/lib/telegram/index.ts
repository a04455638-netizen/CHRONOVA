import { formatUzs } from '../utils/format';

export interface TelegramOrderPayload {
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  region: string;
  city: string;
  address: string;
  delivery_notes?: string;
  payment_method: string;
  total_uzs: number;
  subtotal_uzs: number;
  discount_uzs: number;
  items: Array<{
    name: string;
    sku: string;
    qty: number;
    price_uzs: number;
    total_uzs: number;
  }>;
  created_at?: string;
}

/**
 * Escapes characters for Telegram HTML parse_mode
 */
export function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Formats Telegram HTML notification message
 */
export function formatOrderTelegramMessage(payload: TelegramOrderPayload, siteUrl: string): string {
  const safeName = escapeHtml(payload.customer_name);
  const safePhone = escapeHtml(payload.customer_phone);
  const safeRegion = escapeHtml(payload.region);
  const safeCity = escapeHtml(payload.city);
  const safeAddress = escapeHtml(payload.address);
  const safeNotes = payload.delivery_notes ? escapeHtml(payload.delivery_notes) : '—';
  const paymentLabel = payload.payment_method === 'cash_on_delivery' ? 'Naqd (qabul qilganda)' : 'Karta orqali';

  let itemsText = '';
  payload.items.forEach((item, index) => {
    itemsText += `${index + 1}. <b>${escapeHtml(item.name)}</b>\n   SKU: <code>${escapeHtml(item.sku)}</code> | ${item.qty} dona × ${formatUzs(item.price_uzs)} = <b>${formatUzs(item.total_uzs)}</b>\n`;
  });

  const adminOrderUrl = `${siteUrl.replace(/\/$/, '')}/admin/buyurtmalar/${payload.order_id}`;

  return `✨ <b>CHRONOVA — YANGI BUYURTMA!</b> ✨
━━━━━━━━━━━━━━━━━━━━
📦 <b>Buyurtma raqami:</b> <code>${payload.order_number}</code>
🕒 <b>Vaqt:</b> ${payload.created_at || new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}

👤 <b>Mijoz:</b> ${safeName}
📞 <b>Telefon:</b> <code>${safePhone}</code>
📍 <b>Manzil:</b> ${safeRegion}, ${safeCity}, ${safeAddress}
📝 <b>Izoh:</b> ${safeNotes}

🛍 <b>Mahsulotlar:</b>
${itemsText}
━━━━━━━━━━━━━━━━━━━━
💰 <b>Oraliq summa:</b> ${formatUzs(payload.subtotal_uzs)}
🎁 <b>Chegirma:</b> ${formatUzs(payload.discount_uzs)}
💳 <b>JAMI TO‘LOV:</b> <b>${formatUzs(payload.total_uzs)}</b>
🏷 <b>To‘lov usuli:</b> ${paymentLabel}

🔗 <a href="${adminOrderUrl}">Admin panelda ochish ↗</a>`;
}

/**
 * Sends order message directly to Telegram Bot API
 * Returns success boolean and optional error message
 */
export async function sendTelegramNotification(
  payload: TelegramOrderPayload
): Promise<{ success: boolean; error?: string; mock?: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!token || !chatId) {
    console.warn(
      `[Telegram Dispatcher - Simulation Mode]: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is not configured. Logging notification payload safely for order ${payload.order_number}`
    );
    return { success: true, mock: true };
  }

  const messageText = formatOrderTelegramMessage(payload, siteUrl);

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      const errorMsg = data?.description || `HTTP ${response.status}`;
      console.error(`[Telegram Error] Failed to send message for order ${payload.order_number}:`, errorMsg);
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (err: any) {
    console.error(`[Telegram Network Error] Exception while sending message:`, err.message);
    return { success: false, error: err.message };
  }
}
