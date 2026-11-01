import React from 'react';
import { getAdminAuthStatus } from '@/lib/auth/admin-auth';
import AdminNavClient from './AdminNavClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authStatus = await getAdminAuthStatus();

  return (
    <AdminNavClient
      isAuth={authStatus.authenticated && authStatus.isAdmin}
      user={authStatus.user}
    >
      {children}
    </AdminNavClient>
  );
}
