import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const orderId = body.orderId || body.order_id;
    const status = body.status;
    const comment = body.comment || body.note;

    if (!orderId || !status) {
      return NextResponse.json({ error: 'Ma’lumotlar to‘liq emas' }, { status: 400 });
    }

    const updated = await DataStore.updateOrderStatus(orderId, status, comment);
    if (!updated) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
