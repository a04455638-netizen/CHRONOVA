import React from 'react';
import { DataStore } from '@/lib/data/store';
import AdminReviewsClient from './AdminReviewsClient';

export const metadata = {
  title: 'Sharhlar Moderatsiyasi — CHRONOVA Admin',
};

export default async function AdminReviewsPage() {
  const reviews = await DataStore.getAllReviewsAdmin();

  return <AdminReviewsClient initialReviews={reviews} />;
}
