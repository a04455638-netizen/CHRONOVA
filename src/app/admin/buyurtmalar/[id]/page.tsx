import React from 'react';
import { notFound } from 'next/navigation';
import { DataStore } from '@/lib/data/store';
import OrderDetailClient from './OrderDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Buyurtma Tafsilotlari — CHRONOVA Admin',
};

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await DataStore.getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderDetailClient initialOrder={order} />;
}
