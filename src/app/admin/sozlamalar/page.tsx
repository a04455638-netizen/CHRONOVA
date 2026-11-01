import React from 'react';
import SettingsClient from './SettingsClient';

export const metadata = {
  title: 'Sozlamalar — CHRONOVA Admin',
};

export default function AdminSettingsPage() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  const hasConfig = Boolean(token && chatId);
  const tokenMasked = token ? `${token.slice(0, 6)}••••••••${token.slice(-4)}` : 'Konfiguratsiya qilinmagan';
  const chatIdMasked = chatId ? `${chatId.slice(0, 3)}••••${chatId.slice(-2)}` : 'Konfiguratsiya qilinmagan';

  return (
    <SettingsClient
      hasTelegramConfig={hasConfig}
      botTokenMasked={tokenMasked}
      adminChatIdMasked={chatIdMasked}
    />
  );
}
