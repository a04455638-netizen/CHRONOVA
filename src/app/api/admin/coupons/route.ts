import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';
import { DataStore } from '@/lib/data/store';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const coupons = await DataStore.getCoupons();
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.code) {
      return NextResponse.json({ error: 'Kupon kodi talab qilinadi' }, { status: 400 });
    }

    const saved = await DataStore.saveCoupon(body);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID talab qilinadi' }, { status: 400 });
  }

  const success = await DataStore.deleteCoupon(id);
  return NextResponse.json({ success });
}
