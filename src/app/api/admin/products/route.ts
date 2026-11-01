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
    const product = await DataStore.saveProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID topilmadi' }, { status: 400 });

    const ok = await DataStore.deleteProduct(id);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
