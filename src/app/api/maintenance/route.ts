import { NextResponse } from 'next/server';
import { DataStore } from '@/lib/data/store';

export async function GET() {
  const maintenance = await DataStore.getMaintenanceStatus();
  return NextResponse.json({
    enabled: maintenance.enabled,
    reason: maintenance.reason,
    updated_at: maintenance.updated_at,
  });
}
