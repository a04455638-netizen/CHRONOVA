export const UZBEKISTAN_REGIONS = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Samarqand viloyati',
  'Buxoro viloyati',
  'Farg‘ona viloyati',
  'Andijon viloyati',
  'Namangan viloyati',
  'Qashqadaryo viloyati',
  'Surxondaryo viloyati',
  'Xorazm viloyati',
  'Navoiy viloyati',
  'Jizzax viloyati',
  'Sirdaryo viloyati',
  'Qoraqalpog‘iston Respublikasi',
] as const;

export function formatUzs(amount: number): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return "0 so'm";
  const num = Math.round(Number(amount));
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
}

export function formatDateTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('uz-UZ', {
      timeZone: 'Asia/Tashkent',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function validateUzbekPhone(phone: string): boolean {
  if (!phone) return false;
  // Normalize by stripping non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Matches 9 digits (e.g. 901234567) or 12 digits starting with 998 (e.g. 998901234567)
  if (digits.length === 9) return true;
  if (digits.length === 12 && digits.startsWith('998')) return true;
  return false;
}

export function normalizeUzbekPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  if (digits.startsWith('998') && digits.length === 12) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }
  return phone;
}
