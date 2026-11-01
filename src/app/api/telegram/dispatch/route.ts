import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { sendTelegramNotification } from '@/lib/telegram';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  // Allow if cron header has CRON_SECRET or if admin is authenticated
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'chronova_super_secret_cron_pass_2026';
  const isAuth = await isAdminAuthenticated();

  const isCronAuthorized = authHeader === `Bearer ${cronSecret}`;
  if (!isCronAuthorized && !isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  try {
    const outboxItems = await DataStore.getOutboxLogs();
    const pendingItems = outboxItems.filter((item) => item.status === 'pending');

    let sentCount = 0;
    let failedCount = 0;

    for (const item of pendingItems) {
      item.attempts += 1;
      const res = await sendTelegramNotification(item.payload);
      if (res.success) {
        item.status = 'sent';
        item.sent_at = new Date().toISOString();
        sentCount++;
      } else {
        item.status = 'failed';
        item.last_error = res.error;
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: pendingItems.length,
      sentCount,
      failedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
