import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const phone = searchParams.get('phone');

    if (!id) {
      return NextResponse.json({ error: 'Buyurtma identifikatori kiritilmadi' }, { status: 400 });
    }

    const order = await DataStore.trackOrder(id, phone || undefined);

    if (!order) {
      return NextResponse.json(
        { error: 'Buyurtma topilmadi yoki telefon raqami mos kelmadi.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
