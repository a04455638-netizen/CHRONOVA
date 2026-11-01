import { NextRequest, NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';
import { isAdminAuthenticated } from '@/lib/auth/admin-auth';

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  const maintenance = await DataStore.getMaintenanceStatus();
  return NextResponse.json({ success: true, maintenance });
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Ruxsat berilmadi' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const enabled = Boolean(body.enabled);
    const reason = typeof body.reason === 'string' ? body.reason : undefined;

    const maintenance = await DataStore.setMaintenanceStatus(enabled, reason);
    return NextResponse.json({
      success: true,
      message: enabled
        ? 'Saytda texnik tanaffus rejimi yoqildi.'
        : 'Sayt muvaffaqiyatli onlayn rejimga o‘tkazildi.',
      maintenance,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
