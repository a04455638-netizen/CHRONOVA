import React from 'react';
import { DataStore } from '@/lib/data/store';
import CouponsClient from './CouponsClient';

export const metadata = {
  title: 'Kuponlar Boshqaruvi — CHRONOVA Admin',
};

export default async function AdminCouponsPage() {
  const coupons = await DataStore.getCoupons();

  return <CouponsClient initialCoupons={coupons} />;
}
