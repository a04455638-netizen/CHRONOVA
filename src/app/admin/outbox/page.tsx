import React from 'react';
import { DataStore } from '@/lib/data/store';
import OutboxClient from './OutboxClient';

export const metadata = {
  title: 'Telegram Outbox — CHRONOVA Admin',
};

export default async function AdminOutboxPage() {
  const logs = await DataStore.getOutboxLogs();

  return <OutboxClient initialLogs={logs} />;
}
