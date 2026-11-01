import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, setAdminSession, clearAdminSession } from '@/lib/auth/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email va parolni kiriting' },
        { status: 400 }
      );
    }

    if (!verifyAdminCredentials(email, password)) {
      return NextResponse.json(
        { error: 'Noto‘g‘ri login yoki parol' },
        { status: 401 }
      );
    }

    await setAdminSession({
      email,
      name: 'CHRONOVA Bosh Administrator',
      role: 'admin',
    });
    return NextResponse.json({ success: true, user: { email, role: 'admin' } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ success: true });
}
