import React, { Suspense } from 'react';
import TrackingClient from './TrackingClient';

export const metadata = {
  title: 'Buyurtmani Kuzatish — CHRONOVA',
  description: 'CHRONOVA butikidan xarid qilingan soatlarning yetkazib berish holati va statusini onlayn kuzatish.',
};

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gold-500">Yuklanmoqda...</div>}>
      <TrackingClient />
    </Suspense>
  );
}
