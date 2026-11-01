import React, { Suspense } from 'react';
import ConfirmationClient from './ConfirmationClient';

export const metadata = {
  title: 'Buyurtma Tasdiqlandi — CHRONOVA',
  description: 'Buyurtmangiz muvaffaqiyatli qabul qilindi. CHRONOVA shaxsiy konsyerji tez orada siz bilan bog‘lanadi.',
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gold-500">Yuklanmoqda...</div>}>
      <ConfirmationClient />
    </Suspense>
  );
}
