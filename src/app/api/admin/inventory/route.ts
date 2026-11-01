import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';
import { DataStore } from '@/lib/data/store';

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, newStock } = await req.json();

    if (!productId || typeof newStock !== 'number') {
      return NextResponse.json({ error: 'productId va yangi miqdor (newStock) talab qilinadi' }, { status: 400 });
    }

    const updated = await DataStore.updateProductStock(productId, newStock);
    if (!updated) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
